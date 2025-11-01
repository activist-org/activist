// SPDX-License-Identifier: AGPL-3.0-or-later
import { chromium, type FullConfig } from "@playwright/test";

import { signInAsAdmin } from "~/test-e2e/actions/authentication";
import {
  quickServerHealthCheck,
  waitForServerReady,
} from "~/test-e2e/utils/server-readiness";

/**
 * Global setup runs once before all tests
 * This creates an authenticated session that can be reused across tests for speed
 */
async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL;

  if (!baseURL) {
    throw new Error("baseURL is not configured in playwright.config.ts");
  }

  const fs = await import("fs");
  const path = await import("path");
  const authFile = path.join(__dirname, ".auth", "admin.json");

  // Check if auth state already exists and tokens are still valid.
  if (fs.existsSync(authFile)) {
    try {
      const authData = JSON.parse(fs.readFileSync(authFile, "utf-8"));
      const cookies = authData.cookies || [];
      const authToken = cookies.find(
        (c: { name: string }) => c.name === "auth.token"
      );

      if (authToken && authToken.value) {
        // Decode JWT to check actual token expiration (not just cookie expiration).
        try {
          const payload = JSON.parse(
            Buffer.from(authToken.value.split(".")[1], "base64").toString()
          );
          const jwtExp = payload.exp * 1000; // convert to milliseconds
          const now = Date.now();
          const timeUntilExpiry = jwtExp - now;
          const minutesUntilExpiry = timeUntilExpiry / 1000 / 60;

          // Only reuse if JWT token has at least 5 minutes left.
          if (minutesUntilExpiry > 5) {
            const stats = fs.statSync(authFile);
            const ageInHours = (now - stats.mtimeMs) / 1000 / 60 / 60;
            const displayAge =
              ageInHours < 1
                ? `${Math.round(ageInHours * 60)}m`
                : `${Math.round(ageInHours)}h`;
            const displayExpiry =
              minutesUntilExpiry < 60
                ? `${Math.round(minutesUntilExpiry)}m`
                : `${Math.round(minutesUntilExpiry / 60)}h`;
            // eslint-disable-next-line no-console
            console.log(
              `✓ Using existing authenticated session (${displayAge} old, expires in ${displayExpiry})`
            );
            return;
          } else {
            // eslint-disable-next-line no-console
            console.log(
              "⚠️  JWT token expired or expiring soon, creating new session..."
            );
          }
        } catch {
          // eslint-disable-next-line no-console
          console.log("⚠️  Failed to decode JWT, creating new session...");
        }
      }
    } catch {
      // eslint-disable-next-line no-console
      console.log("⚠️  Invalid auth file, creating new session...");
    }
  }

  // Wait for server to be fully ready (skip if local and already responding).
  const isCI = process.env.CI === "true";
  const skipWarmup = !isCI && (await quickServerHealthCheck(baseURL));

  if (!skipWarmup) {
    // eslint-disable-next-line no-console
    console.log("⏳ Waiting for server to be ready...");
    await waitForServerReady({
      baseURL,
      maxRetries: 15, // more retries for slow startup
      retryDelay: 3000, // longer delay between retries
      timeout: 15000, // longer timeout per request
    });
  } else {
    // eslint-disable-next-line no-console
    console.log("✓ Server already responding (skipped warm-up check)");
  }

  // eslint-disable-next-line no-console
  console.log("🔐 Setting up authenticated session...");

  const maxAuthRetries = 3;
  let authSuccess = false;
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAuthRetries; attempt++) {
    const browser = await chromium.launch();
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();

    try {
      if (attempt > 1) {
        // eslint-disable-next-line no-console
        console.log(`🔄 Retry attempt ${attempt}/${maxAuthRetries}...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // Navigate to sign-in page directly.
      await page.goto("/auth/sign-in", { waitUntil: "load", timeout: 60000 });

      // eslint-disable-next-line no-console
      console.log("📝 Filling in credentials...");

      // Sign in without navigating again (skipNavigation = true).
      await signInAsAdmin(page, "admin", "admin", true);

      // eslint-disable-next-line no-console
      console.log("✓ Successfully authenticated");

      // Wait for page to be fully ready before saving state.
      await page.waitForLoadState("domcontentloaded", { timeout: 30000 });

      // Save authentication state to file.
      await context.storageState({ path: authFile });

      // eslint-disable-next-line no-console
      console.log("✅ Authentication state saved to test-e2e/.auth/admin.json");

      authSuccess = true;
      await browser.close();
      break;
    } catch (error) {
      lastError = error as Error;
      await browser.close();

      if (attempt === maxAuthRetries) {
        // eslint-disable-next-line no-console
        console.error(
          `❌ Global setup failed after ${maxAuthRetries} attempts:`,
          error
        );
      }
    }
  }

  if (!authSuccess) {
    throw lastError || new Error("Authentication failed after retries");
  }
}

export default globalSetup;

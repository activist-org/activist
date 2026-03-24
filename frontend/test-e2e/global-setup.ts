// SPDX-License-Identifier: AGPL-3.0-or-later
import { chromium, type FullConfig } from "@playwright/test";
import fs from "fs";
import path from "path";

import { signInAsAdmin } from "~/test-e2e/actions/authentication";
import {
  quickServerHealthCheck,
  waitForServerReady,
} from "~/test-e2e/utils/server-readiness";

interface AuthAccount {
  username: string;
  password: string;
  authFile: string;
  label: string;
}

// Django SIMPLE_JWT REFRESH_TOKEN_LIFETIME is 1 day. Use 20 h to leave a
// comfortable buffer for a full local test run to complete before expiry.
const MAX_SESSION_AGE_HOURS = 20;

/**
 * Returns true if the auth state file exists, contains a nuxt-session cookie,
 * AND was created within MAX_SESSION_AGE_HOURS (keeping the Django refresh
 * token valid for the duration of the run).
 *
 * On CI the file never exists before the run, so this always returns false
 * there and a fresh session is created every time.
 */
function isAuthStateValid(authFile: string): boolean {
  if (!fs.existsSync(authFile)) return false;

  try {
    const authData = JSON.parse(fs.readFileSync(authFile, "utf-8"));
    const cookies = authData.cookies || [];
    const sessionCookie = cookies.find(
      (c: { name: string }) => c.name === "nuxt-session"
    );

    if (!sessionCookie?.value) return false;

    const ageInHours =
      (Date.now() - fs.statSync(authFile).mtimeMs) / 1000 / 60 / 60;

    if (ageInHours >= MAX_SESSION_AGE_HOURS) {
      // eslint-disable-next-line no-console
      console.log(
        `⚠️  Session for ${authFile.split("/").pop()} is ${Math.round(ageInHours)}h old (limit: ${MAX_SESSION_AGE_HOURS}h) — re-authenticating`
      );
      return false;
    }

    const displayAge =
      ageInHours < 1
        ? `${Math.round(ageInHours * 60)}m`
        : `${Math.round(ageInHours)}h`;
    // eslint-disable-next-line no-console
    console.log(
      `✓ Reusing existing session for ${authFile.split("/").pop()} (${displayAge} old, limit: ${MAX_SESSION_AGE_HOURS}h)`
    );
    return true;
  } catch {
    // Fall through to re-authenticate.
  }
  return false;
}

/**
 * Signs in as the given account and saves the browser storage state to disk,
 * retrying up to maxRetries times on failure.
 */
async function createAuthState(
  baseURL: string,
  account: AuthAccount
): Promise<void> {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const browser = await chromium.launch();
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();

    try {
      if (attempt > 1) {
        // eslint-disable-next-line no-console
        console.log(
          `🔄 Retry attempt ${attempt}/${maxRetries} for ${account.label}...`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      await page.goto("/auth/sign-in", { waitUntil: "load", timeout: 60000 });

      // eslint-disable-next-line no-console
      console.log(`📝 Signing in as ${account.label} (${account.username})...`);

      await signInAsAdmin(page, account.username, account.password, true);

      // eslint-disable-next-line no-console
      console.log(`✓ Authenticated as ${account.label}`);

      await page.waitForLoadState("domcontentloaded", { timeout: 30000 });
      await context.storageState({ path: account.authFile });

      // eslint-disable-next-line no-console
      console.log(`✅ Session saved to ${account.authFile}`);

      await browser.close();
      return;
    } catch (error) {
      await browser.close();
      if (attempt === maxRetries) {
        // eslint-disable-next-line no-console
        console.error(
          `❌ Auth setup failed for ${account.label} after ${maxRetries} attempts:`,
          error
        );
        throw error;
      }
    }
  }
}

/**
 * Global setup runs once before all tests.
 * Creates authenticated sessions for each account used in the test suite.
 */
async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL;

  if (!baseURL) {
    throw new Error("baseURL is not configured in playwright.config.ts");
  }

  const accounts: AuthAccount[] = [
    {
      username: "admin",
      password: "admin",
      authFile: path.join(__dirname, ".auth", "admin.json"),
      label: "admin",
    },
    {
      username: "activist_0",
      password: "password",
      authFile: path.join(__dirname, ".auth", "member.json"),
      label: "non-admin member",
    },
  ];

  if (accounts.every((a) => isAuthStateValid(a.authFile))) {
    return;
  }

  const isCI = process.env.CI === "true";
  const skipWarmup = !isCI && (await quickServerHealthCheck(baseURL));

  if (!skipWarmup) {
    // eslint-disable-next-line no-console
    console.log("⏳ Waiting for server to be ready...");
    await waitForServerReady({
      baseURL,
      maxRetries: 15,
      retryDelay: 3000,
      timeout: 15000,
    });
  } else {
    // eslint-disable-next-line no-console
    console.log("✓ Server already responding (skipped warm-up check)");
  }

  // eslint-disable-next-line no-console
  console.log("🔐 Setting up authenticated sessions...");

  const authDir = path.join(__dirname, ".auth");
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  for (const account of accounts) {
    if (isAuthStateValid(account.authFile)) continue;
    await createAuthState(baseURL, account);
  }
}

export default globalSetup;

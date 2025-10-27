// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { test as base, expect as baseExpect } from "@playwright/test";

import { signInAsAdmin } from "~/test-e2e/actions/authentication";

// Track last renewal time per worker to avoid redundant re-auths
let lastRenewalTime = 0;

/**
 * Check if JWT access token is expired or expiring soon
 * @param page - Playwright page object
 * @returns true if token needs renewal
 */
async function isTokenExpired(page: Page): Promise<boolean> {
  const cookies = await page.context().cookies();
  const authToken = cookies.find((c) => c.name === "auth.token");

  if (!authToken?.value) {
    return false; // No token = probably @unauth test
  }

  // Don't check again if we just renewed within the last 3 minutes.
  // Since tokens last 5 min and we renew at <2 min, a fresh token is good for 3 min.
  const timeSinceRenewal = Date.now() - lastRenewalTime;
  if (timeSinceRenewal < 180000) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(authToken.value.split(".")[1], "base64").toString()
    );
    const jwtExp = payload.exp * 1000;
    const minutesUntilExpiry = (jwtExp - Date.now()) / 1000 / 60;

    return minutesUntilExpiry < 2;
  } catch {
    return false;
  }
}

/**
 * Custom test fixtures with automatic JWT token renewal.
 *
 * Before each test runs, checks if JWT is expired and auto-renews.
 * Skips renewal for @unauth tests (detected by test tags).
 */
export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use, testInfo) => {
    // Skip token renewal for @unauth tests (sign-in, sign-up tests)
    const isUnauthTest = testInfo.tags.includes("@unauth");

    if (!isUnauthTest) {
      const needsRenewal = await isTokenExpired(page);

      if (needsRenewal) {
        // eslint-disable-next-line no-console
        console.log("⚠️  JWT token expired, re-authenticating...");

        await page.goto("/auth/sign-in", { waitUntil: "load" });
        await signInAsAdmin(page, "admin", "admin", true);

        // Update the admin.json file so subsequent tests get fresh token
        const path = await import("path");
        const authFile = path.join(__dirname, ".auth", "admin.json");
        await page.context().storageState({ path: authFile });

        // Update renewal timestamp
        lastRenewalTime = Date.now();

        // eslint-disable-next-line no-console
        console.log(
          "✓ Re-authenticated successfully (token saved to admin.json)"
        );
      }
    }

    await use(page);
  },
});

export { baseExpect as expect };

// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  type Page,
  test as base,
  expect as baseExpect,
} from "@playwright/test";

import { signIn, signInAsAdmin } from "~/test-e2e/actions/authentication";
import {
  ADMIN_AUTH_STATE_PATH,
  MEMBER_AUTH_STATE_PATH,
} from "~/test-e2e/constants/authPaths";

export { MEMBER_AUTH_STATE_PATH };

// Track last renewal time per worker to avoid redundant re-auths.
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
    return false; // no token = probably @unauth test
  }

  // Don't check again if we just renewed within the last 3 minutes.
  // Since tokens last 5 min and we renew at <2 min, a fresh token is good for 3 min.
  const timeSinceRenewal = Date.now() - lastRenewalTime;
  if (timeSinceRenewal < 180000) {
    return false;
  }

  try {
    const jwtPart = authToken.value.split(".")[1];
    if (!jwtPart) return false;

    const payload = JSON.parse(Buffer.from(jwtPart, "base64").toString());
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
 * Skips renewal for "@unauth" tests (detected by test tags).
 */
export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use, testInfo) => {
    // Skip token renewal for "@unauth" tests (sign-in, sign-up tests).
    const isUnauthTest = testInfo.tags.includes("@unauth");

    if (!isUnauthTest) {
      const isMemberTest = testInfo.tags.includes("@member");
      const needsRenewal = await isTokenExpired(page);

      // For @member tests: validate stored session with one auth request; only
      // re-sign-in when the backend returns 401 (stale/expired or wrong backend).
      if (isMemberTest) {
        const res = await page.request.get(
          "/api/auth/events/events?page_size=1"
        );
        if (res.status() === 401) {
          await page.goto("/auth/sign-in", { waitUntil: "load" });
          await signIn(page, "activist_0", "password", "**/home");
          await page.context().storageState({ path: MEMBER_AUTH_STATE_PATH });
          lastRenewalTime = Date.now();
        }
      } else if (needsRenewal) {
        await page.goto("/auth/sign-in", { waitUntil: "load" });
        await signInAsAdmin(page, "admin", "admin", true);
        await page.context().storageState({ path: ADMIN_AUTH_STATE_PATH });
        lastRenewalTime = Date.now();
      }
    }

    await use(page);
  },
});

export { baseExpect as expect };

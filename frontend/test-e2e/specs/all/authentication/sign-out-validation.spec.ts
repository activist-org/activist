// SPDX-License-Identifier: AGPL-3.0-or-later
import { signIn, signOut } from "~/test-e2e/actions/authentication";
import { expect, test } from "~/test-e2e/global-fixtures";

test.describe("Sign out", () => {
  // Don't use global auth state - create fresh session for each test.
  // Use a non-admin user so sign-out doesn't invalidate admin sessions.
  test.use({ storageState: undefined });

  test.beforeEach(async ({ page }) => {
    // Sign in as activist_0 (confirmed by populate_db for E2E tests).
    // This prevents sign-out from invalidating the admin session used by other tests.
    await signIn(page, "activist_0", "password");
  });

  test(
    "User can sign out successfully",
    { tag: ["@desktop", "@mobile"] },
    async ({ page }) => {
      // Verify we're signed in.
      const cookiesSignIn = await page.context().cookies();
      const sessionCookie = cookiesSignIn.find(
        (c) => c.name === "nuxt-session"
      );
      expect(sessionCookie).toBeDefined();
      await signOut(page);
      // Wait for sign-out to complete (logout API + session clear); poll for cookie.
      const maxAttempts = 25;
      for (let i = 0; i < maxAttempts; i++) {
        const cookiesSignOut = await page.context().cookies();
        const sessionCookie = cookiesSignOut.find(
          (c) => c.name === "nuxt-session"
        );
        if (!sessionCookie || sessionCookie.value === "") break;
        await page.waitForTimeout(200);
      }
      const cookiesSignOut = await page.context().cookies();
      const sessionCookieAfterSignOut = cookiesSignOut.find(
        (c) => c.name === "nuxt-session"
      );
      // nuxt-auth-utils clears session by setting cookie to empty, not removing it.
      expect(
        !sessionCookieAfterSignOut || sessionCookieAfterSignOut.value === ""
      ).toBe(true);
    }
  );
});

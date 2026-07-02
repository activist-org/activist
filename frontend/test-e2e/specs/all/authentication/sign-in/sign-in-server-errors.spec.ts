// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "#shared/utils/i18n";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newSignInPage } from "~/test-e2e/page-objects/SignInPage";

test.beforeEach(async ({ page }) => {
  await page.goto("/auth/sign-in");
});

test.describe(
  "Sign In Page - Server Errors",
  { tag: ["@desktop", "@mobile", "@unauth"] },
  () => {
    // Override to run without authentication.
    test.use({ storageState: undefined });

    // Explicitly clear all cookies to ensure unauthenticated state.
    test.beforeEach(async ({ context }) => {
      await context.clearCookies();
    });

    // Remove all route mocks after each test to prevent leakage.
    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    // MARK: Wrong Credentials

    test("Page shows error for wrong credentials (401)", async ({ page }) => {
      await page.route("**/api/session/login", (route) =>
        route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ detail: "Invalid credentials." }),
        })
      );

      const signInPage = newSignInPage(page);
      await signInPage.usernameInput.fill("wronguser");
      await signInPage.passwordInput.fill("wrongpassword");

      const { captcha } = signInPage;
      if (await captcha.isVisible()) {
        await captcha.click();
      }

      await signInPage.signInButton.click();

      const errorToast = page.locator('[data-sonner-toast][data-type="error"]');
      await expect(errorToast).toBeVisible();
      await expect(errorToast).toContainText(
        getEnglishText("i18n.pages.auth.sign_in.invalid_credentials")
      );
      expect(page.url()).toContain("/auth/sign-in");
    });

    test("Page shows same error for non-existent username (401)", async ({
      page,
    }) => {
      await page.route("**/api/session/login", (route) =>
        route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ detail: "Invalid credentials." }),
        })
      );

      const signInPage = newSignInPage(page);
      await signInPage.usernameInput.fill("nonexistentuser12345");
      await signInPage.passwordInput.fill("somepassword");

      const { captcha } = signInPage;
      if (await captcha.isVisible()) {
        await captcha.click();
      }

      await signInPage.signInButton.click();

      const errorToast = page.locator('[data-sonner-toast][data-type="error"]');
      await expect(errorToast).toBeVisible();
      await expect(errorToast).toContainText(
        getEnglishText("i18n.pages.auth.sign_in.invalid_credentials")
      );
      expect(page.url()).toContain("/auth/sign-in");
    });

    // MARK: Rate Limiting

    test("Page shows error when rate limited (429)", async ({ page }) => {
      await page.route("**/api/session/login", (route) =>
        route.fulfill({
          status: 429,
          headers: { "Retry-After": "60" },
          contentType: "application/json",
          body: JSON.stringify({ detail: "Too many requests." }),
        })
      );

      const signInPage = newSignInPage(page);
      await signInPage.usernameInput.fill("anyuser");
      await signInPage.passwordInput.fill("anypassword");

      const { captcha } = signInPage;
      if (await captcha.isVisible()) {
        await captcha.click();
      }

      await signInPage.signInButton.click();

      const errorToast = page.locator('[data-sonner-toast][data-type="error"]');
      await expect(errorToast).toBeVisible();
      await expect(errorToast).toContainText(
        getEnglishText("i18n.pages.auth._global.error_occurred")
      );
      expect(page.url()).toContain("/auth/sign-in");
    });

    // MARK: Network Failure

    test("Page shows error on network failure", async ({ page }) => {
      await page.route("**/api/session/login", (route) =>
        route.abort("failed")
      );

      const signInPage = newSignInPage(page);
      await signInPage.usernameInput.fill("anyuser");
      await signInPage.passwordInput.fill("anypassword");

      const { captcha } = signInPage;
      if (await captcha.isVisible()) {
        await captcha.click();
      }

      await signInPage.signInButton.click();

      const errorToast = page.locator('[data-sonner-toast][data-type="error"]');
      await expect(errorToast).toBeVisible();
      expect(page.url()).toContain("/auth/sign-in");
    });

    // MARK: Recovery

    test("User can recover and sign in after a mocked error", async ({
      page,
    }) => {
      // Intercept with a 401 to trigger the error state.
      await page.route("**/api/session/login", (route) =>
        route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ detail: "Invalid credentials." }),
        })
      );

      const signInPage = newSignInPage(page);
      await signInPage.usernameInput.fill("wronguser");
      await signInPage.passwordInput.fill("wrongpassword");

      const { captcha } = signInPage;
      if (await captcha.isVisible()) {
        await captcha.click();
      }

      await signInPage.signInButton.click();

      const errorToast = page.locator('[data-sonner-toast][data-type="error"]');
      await expect(errorToast).toBeVisible();

      // Remove the mock so the next request hits the real backend.
      await page.unrouteAll();

      // Re-fill with valid credentials and resubmit.
      await signInPage.usernameInput.fill("admin");
      await signInPage.passwordInput.fill("admin");

      const captchaAfterError = signInPage.captcha;
      if (await captchaAfterError.isVisible()) {
        await captchaAfterError.click();
      }

      await signInPage.signInButton.click();

      await page.waitForURL("**/home");
      expect(page.url()).toContain("/home");
    });
  }
);

// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "~/test-e2e/global-fixtures";
import { newSignInPage } from "~/test-e2e/page-objects/SignInPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  await page.goto("/auth/sign-in");
});

test.describe(
  "Sign In Page - Authentication",
  { tag: ["@desktop", "@mobile", "@unauth"] },
  () => {
    // Override to run without authentication.
    test.use({ storageState: undefined });

    // Explicitly clear all cookies to ensure unauthenticated state.
    test.beforeEach(async ({ context }) => {
      await context.clearCookies();
    });

    // MARK: PASSWORD VISIBILITY

    test("User can show and hide password", async ({ page }) => {
      const signInPage = newSignInPage(page);
      const { passwordInput } = signInPage;

      // Wait for the page to load completely.
      await page.waitForLoadState("domcontentloaded");

      // Wait for the password input to be visible.
      await expect(passwordInput).toBeVisible();

      await passwordInput.fill("testpassword");
      await expect(passwordInput).toHaveAttribute("type", "password");

      // Wait for the show password toggle to be visible.
      await expect(signInPage.showPasswordToggle).toBeVisible();

      await signInPage.showPasswordToggle.click();
      await expect(passwordInput).toHaveAttribute("type", "text");

      await signInPage.showPasswordToggle.click();
      await expect(passwordInput).toHaveAttribute("type", "password");
    });

    // MARK: NAVIGATION

    test("User can go to Reset Password page", async ({ page }) => {
      const signInPage = newSignInPage(page);

      await signInPage.forgotPasswordLink.click();
      await page.waitForURL("**/auth/pwreset/email");

      expect(page.url()).toContain("/auth/pwreset/email");
    });

    // MARK: SIGN IN FLOW

    test("User can sign in and go to home page", async ({ page }) => {
      const signInPage = newSignInPage(page);

      await signInPage.usernameInput.fill("admin");
      await signInPage.passwordInput.fill("admin");

      // Click CAPTCHA if present.
      const { captcha } = signInPage;
      if (await captcha.isVisible()) {
        await captcha.click();
      }

      await signInPage.signInButton.click();

      await page.waitForURL("**/home");
      expect(page.url()).toContain("/home");
      // Should be redirected to the home page AND sidebar left should have create button.
    });

    test("User will have token saved in cookie", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const signInPage = newSignInPage(page);

      await withTestStep(testInfo, "Fill in credentials", async () => {
        await signInPage.usernameInput.fill("admin");
        await signInPage.passwordInput.fill("admin");
      });

      await withTestStep(testInfo, "Handle CAPTCHA if present", async () => {
        const { captcha } = signInPage;
        if (await captcha.isVisible()) {
          await captcha.click();
        }
      });

      await withTestStep(testInfo, "Submit sign-in form", async () => {
        await signInPage.signInButton.click();
      });
      await withTestStep(
        testInfo,
        "Verify successful authentication",
        async () => {
          await page.waitForURL("**/home");
          const cookies = await page.context().cookies();
          const sessionCookie = cookies.find((c) => c.name === "auth.token");
          expect(sessionCookie).toBeDefined();
        }
      );
    });
  }
);

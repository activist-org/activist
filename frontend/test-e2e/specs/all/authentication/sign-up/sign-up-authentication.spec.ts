// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "#shared/utils/i18n";

import { signIn } from "~/test-e2e/actions/authentication";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newSignInPage } from "~/test-e2e/page-objects/SignInPage";
import { newSignUpPage } from "~/test-e2e/page-objects/SignUpPage";
import { clearEmails, waitAndConfirmEmail } from "~/test-e2e/utils/mailhog";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  await page.goto("/auth/sign-up");
});

test.describe.serial(
  "Sign Up Page - Authentication",
  { tag: ["@desktop", "@mobile", "@unauth"] },
  () => {
    test.use({ storageState: undefined });

    test.beforeEach(async ({ context }) => {
      await context.clearCookies();
    });

    // MARK: Sign Up Flow

    test("User can sign up, confirm email, and sign in", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const username = `testuser_${Date.now()}`;
      const email = `${username}@example.com`;
      const password = "Activist123!?";

      const signUpPage = newSignUpPage(page);

      await clearEmails();

      await withTestStep(testInfo, "Fill in sign-up form", async () => {
        await signUpPage.usernameInput.fill(username);
        await signUpPage.emailInput.fill(email);
        await signUpPage.passwordInput.fill(password);
        await signUpPage.repeatPasswordInput.fill(password);
      });

      await withTestStep(testInfo, "Handle captcha and terms", async () => {
        if (await signUpPage.captcha.isVisible({ timeout: 2000 })) {
          await signUpPage.captcha.click();
        }
        await signUpPage.termsCheckbox.click();
      });

      await withTestStep(testInfo, "Submit sign-up form", async () => {
        await signUpPage.submitButton.click();
        await expect(page).toHaveURL(/\/auth\/confirm\/email/, {
          timeout: 10000,
        });
      });

      await withTestStep(testInfo, "Confirm email via link", async () => {
        await waitAndConfirmEmail(page);
      });

      await withTestStep(testInfo, "Sign in with new account", async () => {
        await signIn(page, username, password);
      });

      await withTestStep(
        testInfo,
        "Verify successful authentication",
        async () => {
          await page.waitForURL("**/home");
          const cookies = await page.context().cookies();
          const sessionCookie = cookies.find((c) => c.name === "nuxt-session");
          expect(sessionCookie).toBeDefined();
        }
      );
    });

    // MARK: Unconfirmed User

    test("Unconfirmed user sees error on sign in attempt", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const username = `testuser_${Date.now()}`;
      const email = `${username}@example.com`;
      const password = "Activist123!?";

      const signUpPage = newSignUpPage(page);

      await withTestStep(testInfo, "Fill in sign-up form", async () => {
        await signUpPage.usernameInput.fill(username);
        await signUpPage.emailInput.fill(email);
        await signUpPage.passwordInput.fill(password);
        await signUpPage.repeatPasswordInput.fill(password);
      });

      await withTestStep(testInfo, "Handle captcha and terms", async () => {
        if (await signUpPage.captcha.isVisible({ timeout: 2000 })) {
          await signUpPage.captcha.click();
        }
        await signUpPage.termsCheckbox.click();
      });

      await withTestStep(testInfo, "Submit sign-up form", async () => {
        await signUpPage.submitButton.click();
        await expect(page).toHaveURL(/\/auth\/confirm\/email/, {
          timeout: 10000,
        });
      });

      await withTestStep(
        testInfo,
        "Attempt sign in without confirming email",
        async () => {
          await page.goto("/auth/sign-in");
          const signInPage = newSignInPage(page);

          await signInPage.usernameInput.fill(username);
          await signInPage.passwordInput.fill(password);

          if (await signInPage.captcha.isVisible({ timeout: 2000 })) {
            await signInPage.captcha.click();
          }

          await signInPage.signInButton.click();

          const errorToast = page.locator(
            '[data-sonner-toast][data-type="error"]'
          );
          await expect(errorToast).toBeVisible();
          await expect(errorToast).toContainText(
            new RegExp(
              getEnglishText("i18n.pages.auth.sign_in.invalid_credentials"),
              "i"
            )
          );

          expect(page.url()).toContain("/auth/sign-in");
        }
      );
    });
  }
);

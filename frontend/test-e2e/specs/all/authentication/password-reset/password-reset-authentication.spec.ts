// SPDX-License-Identifier: AGPL-3.0-or-later
import { signIn } from "~/test-e2e/actions/authentication";
import { expect, test } from "~/test-e2e/global-fixtures";
import {
  newPasswordResetCodePage,
  newPasswordResetRequestPage,
  newResetPasswordIndexPage,
} from "~/test-e2e/page-objects/PasswordResetPage";
import { newSignUpPage } from "~/test-e2e/page-objects/SignUpPage";
import {
  clearEmails,
  waitAndConfirmEmail,
  waitAndOpenPasswordResetLink,
} from "~/test-e2e/utils/mailhog";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

function isPostPasswordRequestLanding(url: string): boolean {
  let path: string;
  try {
    path = new URL(url).pathname.replace(/\/$/, "") || "/";
  } catch {
    return false;
  }
  if (path === "" || path === "/") return true;
  if (path.endsWith("/home")) return true;
  if (/^\/[a-z]{2}(-[A-Z]{2})?$/i.test(path)) return true;
  return false;
}

test.describe.serial(
  "Password Reset Page - MailHog flow",
  { tag: ["@desktop", "@mobile", "@unauth"] },
  () => {
    test.use({ storageState: undefined });

    test.beforeEach(async ({ context }) => {
      await context.clearCookies();
    });

    test.afterEach(async () => {
      await clearEmails();
    });

    test("User can reset password via email and sign in with new password", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const username = `pwreset_${Date.now()}`;
      const email = `${username}@example.com`;
      const initialPassword = "Activist123!?";
      const newPassword = "Activist456!?New";

      const signUpPage = newSignUpPage(page);

      await clearEmails();

      await withTestStep(testInfo, "Register and confirm email", async () => {
        await page.goto("/auth/sign-up");
        await signUpPage.usernameInput.fill(username);
        await signUpPage.emailInput.fill(email);
        await signUpPage.passwordInput.fill(initialPassword);
        await signUpPage.repeatPasswordInput.fill(initialPassword);
        if (await signUpPage.captcha.isVisible({ timeout: 2000 })) {
          await signUpPage.captcha.click();
        }
        await signUpPage.termsCheckbox.click();
        await signUpPage.submitButton.click();
        await expect(page).toHaveURL(/\/auth\/confirm\/email/, {
          timeout: 10000,
        });
        await waitAndConfirmEmail(page);
      });

      await clearEmails();

      await withTestStep(testInfo, "Request password reset email", async () => {
        await page.goto("/auth/pwreset/email");
        const requestPage = newPasswordResetRequestPage(page);
        await requestPage.emailInput.fill(email);
        const resetPost = page.waitForResponse(
          (res) =>
            /\/api\/session\/passwordReset\/?$/i.test(
              new URL(res.url()).pathname
            ) &&
            res.request().method() === "POST" &&
            res.status() === 200,
          { timeout: 20000 }
        );
        await requestPage.submitButton.click();
        await resetPost;
        await expect
          .poll(() => isPostPasswordRequestLanding(page.url()), {
            timeout: 15000,
          })
          .toBeTruthy();
      });

      await withTestStep(testInfo, "Open reset link from MailHog", async () => {
        await waitAndOpenPasswordResetLink(page);
        await expect(page).toHaveURL(/\/auth\/pwreset\/[a-f0-9-]+/i);
      });

      await withTestStep(testInfo, "Set new password", async () => {
        const codePage = newPasswordResetCodePage(page);
        await expect(codePage.submitButton).toBeVisible();
        await codePage.passwordInput.fill(newPassword);
        await codePage.repeatPasswordInput.fill(newPassword);
        const verifyPost = page.waitForResponse(
          (res) =>
            res.url().includes("/api/session/") &&
            res.url().includes("/verifyEmailPasswordReset") &&
            res.request().method() === "POST" &&
            res.status() === 200,
          { timeout: 20000 }
        );
        await codePage.submitButton.click();
        await verifyPost;
        await page.waitForURL("**/auth/sign-in", { timeout: 15000 });
      });

      await withTestStep(testInfo, "Sign in with new password", async () => {
        await signIn(page, username, newPassword);
        expect(page.url()).toContain("/home");
      });
    });
  }
);

test.describe(
  "Password Reset Page - Validation and Navigation",
  { tag: ["@desktop", "@mobile", "@unauth"] },
  () => {
    test.use({ storageState: undefined });

    test.beforeEach(async ({ context }) => {
      await context.clearCookies();
    });

    // MARK: Validation

    test("Password reset email page rejects invalid email format", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await page.goto("/auth/pwreset/email");
      const requestPage = newPasswordResetRequestPage(page);
      await requestPage.emailInput.fill("not-a-valid-email");
      await requestPage.submitButton.click();
      await expect(page.getByRole("alert")).toContainText(
        /Invalid email address|i18n\.pages\.auth\._global\.invalid_email/i
      );
    });

    // MARK: Navigation

    test("User can open reset-password page and return to sign-in", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await page.goto("/auth/reset-password");
      const resetPage = newResetPasswordIndexPage(page);
      await expect(resetPage.usernameOrEmailInput).toBeVisible();
      await expect(resetPage.submitButton).toBeVisible();
      await resetPage.backToSignInLink.click();
      await page.waitForURL("**/auth/sign-in");
    });
  }
);

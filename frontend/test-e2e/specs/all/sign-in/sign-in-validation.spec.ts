// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { newPasswordStrength } from "~/test-e2e/component-objects/PasswordStrength";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newSignInPage } from "~/test-e2e/page-objects/SignInPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";
import {
  PASSWORD_STRENGTH_COLOR as COLOR,
  PASSWORD_PROGRESS as PROGRESS,
  PASSWORD_RATING as RATING,
} from "~/test-utils/constants";

test.beforeEach(async ({ page }) => {
  await page.goto("/auth/sign-in");
});

test.describe(
  "Sign In Page - Validation",
  { tag: ["@desktop", "@mobile", "@unauth"] },
  () => {
    // Override to run without authentication.
    test.use({ storageState: undefined });

    // Explicitly clear all cookies to ensure unauthenticated state.
    test.beforeEach(async ({ context }) => {
      await context.clearCookies();
    });

    // MARK: PASSWORD STRENGTH

    test("Page shows user password strength rating", async ({ page }) => {
      const signInPage = newSignInPage(page);
      const passwordStrength = newPasswordStrength(page);

      const passwords: {
        password: string;
        expected: {
          text: string;
          color: RegExp | "";
          progress: RegExp;
        };
      }[] = [
        {
          password: "a",
          expected: {
            text: RATING.VERY_WEAK,
            color: COLOR.RED ?? "",
            progress: PROGRESS.P20,
          },
        },
        {
          password: "Activis",
          expected: {
            text: RATING.WEAK,
            color: COLOR.ORANGE ?? "",
            progress: PROGRESS.P40,
          },
        },
        {
          password: "Activist4Climat",
          expected: {
            text: RATING.MEDIUM,
            color: COLOR.YELLOW ?? "",
            progress: PROGRESS.P60,
          },
        },
        {
          password: "Activist4ClimateChange",
          expected: {
            text: RATING.STRONG,
            color: COLOR.GREEN ?? "",
            progress: PROGRESS.P80,
          },
        },
        {
          password: "Activist4ClimateChange!",
          expected: {
            text: RATING.VERY_STRONG,
            color: COLOR.PRIMARY_TEXT ?? "",
            progress: PROGRESS.P100,
          },
        },
        {
          password: "",
          expected: {
            text: RATING.INVALID,
            color: COLOR.NONE ?? "",
            progress: PROGRESS.P20,
          },
        },
      ];

      for (const { password, expected } of passwords) {
        await signInPage.passwordInput.fill(password);

        await expect(passwordStrength.text).toContainText(expected.text);
        await passwordStrength.expectProgress(expected.progress);
        await passwordStrength.expectColor(expected.color);
      }
    });

    // MARK: CAPTCHA

    test("Page displays captcha", async ({ page }) => {
      const signInPage = newSignInPage(page);

      await expect(signInPage.captcha).toBeVisible();
    });

    // MARK: ERROR HANDLING

    test("Page shows error for invalid credentials", async ({ page }) => {
      const signInPage = newSignInPage(page);

      await signInPage.usernameInput.fill("invaliduser");
      await signInPage.passwordInput.fill("invaliduser");

      // Click CAPTCHA if present.
      const { captcha } = signInPage;
      if (await captcha.isVisible()) {
        await captcha.click();
      }

      await signInPage.signInButton.click();

      // Wait for error toast to appear.
      const errorToast = page.locator('[data-sonner-toast][data-type="error"]');
      await expect(errorToast).toBeVisible();

      // Verify error message content.
      await expect(errorToast).toContainText(/invalid username or password/i);

      // Verify we stay on sign-in page.
      expect(page.url()).toContain("/auth/sign-in");
    });

    // MARK: ACCESSIBILITY

    test(
      "Sign In Page has no detectable accessibility issues",
      { tag: "@accessibility" },
      async ({ page }, testInfo) => {
        logTestPath(testInfo);

        await withTestStep(
          testInfo,
          "Wait for lang attribute to be set",
          async () => {
            await expect(page.locator("html")).toHaveAttribute(
              "lang",
              /^[a-z]{2}(-[A-Z]{2})?$/
            );
          }
        );

        await withTestStep(testInfo, "Run accessibility scan", async () => {
          const violations = await runAccessibilityTest(
            "Sign In Page",
            page,
            testInfo
          );
          expect
            .soft(violations, "Accessibility violations found:")
            .toHaveLength(0);
          if (violations.length > 0) {
            // Note: For future implementation.
          }
        });
      }
    );
  }
);

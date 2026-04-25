// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "#shared/utils/i18n";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { newPasswordStrength } from "~/test-e2e/component-objects/PasswordStrength";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newSignUpPage } from "~/test-e2e/page-objects/SignUpPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/test-traceability";
import {
  PASSWORD_STRENGTH_COLOR as COLOR,
  PASSWORD_PROGRESS as PROGRESS,
  PASSWORD_RATING as RATING,
} from "~/test/constants";

test.beforeEach(async ({ page }) => {
  await page.goto("/auth/sign-up");
});

test.describe(
  "Sign Up Page - Validation",
  { tag: ["@desktop", "@mobile", "@unauth"] },
  () => {
    test.use({ storageState: undefined });

    test.beforeEach(async ({ context }) => {
      await context.clearCookies();
    });

    // MARK: Pass Visibility

    test("User can show and hide password", async ({ page }) => {
      const signUpPage = newSignUpPage(page);

      await page.waitForLoadState("domcontentloaded");

      await signUpPage.passwordInput.fill("testpassword");
      await expect(signUpPage.passwordInput).toHaveAttribute(
        "type",
        "password"
      );

      await expect(signUpPage.showPasswordToggle).toBeVisible();
      await signUpPage.showPasswordToggle.click();
      await expect(signUpPage.passwordInput).toHaveAttribute("type", "text");

      await signUpPage.showPasswordToggle.click();
      await expect(signUpPage.passwordInput).toHaveAttribute(
        "type",
        "password"
      );
    });

    test("User can show and hide repeat password", async ({ page }) => {
      const signUpPage = newSignUpPage(page);

      await page.waitForLoadState("domcontentloaded");

      await signUpPage.repeatPasswordInput.fill("testpassword");
      await expect(signUpPage.repeatPasswordInput).toHaveAttribute(
        "type",
        "password"
      );

      await expect(signUpPage.showRepeatPasswordToggle).toBeVisible();
      await signUpPage.showRepeatPasswordToggle.click();
      await expect(signUpPage.repeatPasswordInput).toHaveAttribute(
        "type",
        "text"
      );

      await signUpPage.showRepeatPasswordToggle.click();
      await expect(signUpPage.repeatPasswordInput).toHaveAttribute(
        "type",
        "password"
      );
    });

    // MARK: Pass Strength

    test("Page shows user password strength rating", async ({ page }) => {
      const signUpPage = newSignUpPage(page);
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
        await signUpPage.passwordInput.fill(password);

        await expect(passwordStrength.text).toContainText(expected.text);
        await passwordStrength.expectProgress(expected.progress);
        await passwordStrength.expectColor(expected.color);
      }
    });

    // MARK: Captcha

    test("Page displays captcha", async ({ page }) => {
      const signUpPage = newSignUpPage(page);

      await expect(signUpPage.captcha).toBeVisible();
    });

    // MARK: Password Validation

    test("Page shows error for mismatched passwords", async ({ page }) => {
      const signUpPage = newSignUpPage(page);

      await signUpPage.usernameInput.fill("testuser");
      await signUpPage.emailInput.fill("test@example.com");
      await signUpPage.passwordInput.fill("Activist123!?");
      await signUpPage.repeatPasswordInput.fill("Different123!?");

      if (await signUpPage.captcha.isVisible({ timeout: 2000 })) {
        await signUpPage.captcha.click();
      }
      await signUpPage.termsCheckbox.click();
      await signUpPage.submitButton.click();

      await expect(
        page.getByRole("alert").filter({
          hasText: new RegExp(
            getEnglishText("i18n.pages.auth._global.password_not_matched"),
            "i"
          ),
        })
      ).toBeVisible();
    });

    test("Page shows error for weak password", async ({ page }) => {
      const signUpPage = newSignUpPage(page);

      await signUpPage.usernameInput.fill("testuser");
      await signUpPage.emailInput.fill("test@example.com");
      await signUpPage.passwordInput.fill("weak");
      await signUpPage.repeatPasswordInput.fill("weak");

      if (await signUpPage.captcha.isVisible({ timeout: 2000 })) {
        await signUpPage.captcha.click();
      }
      await signUpPage.termsCheckbox.click();
      await signUpPage.submitButton.click();

      await expect(
        page.getByRole("alert").filter({
          hasText: new RegExp(
            getEnglishText("i18n.pages.auth._global.password_rule_not_correct"),
            "i"
          ),
        })
      ).toBeVisible();
    });

    // MARK: Navigation

    test("User can go to Sign In page", async ({ page }) => {
      const signUpPage = newSignUpPage(page);

      await signUpPage.signInLink.click();
      await page.waitForURL("**/auth/sign-in");

      expect(page.url()).toContain("/auth/sign-in");
    });

    // MARK: Accessibility

    test(
      "Sign Up Page has no detectable accessibility issues",
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
            "Sign Up Page",
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

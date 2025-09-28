// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { newPasswordStrength } from "~/test-e2e/component-objects/PasswordStrength";
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

test.describe("Sign In Page", { tag: ["@desktop", "@mobile"] }, () => {
  test("User can show and hide password", async ({ page }) => {
    const signInPage = newSignInPage(page);
    const passwordInput = signInPage.passwordInput;

    await passwordInput.fill("testpassword");
    await expect(passwordInput).toHaveAttribute("type", "password");

    await signInPage.showPasswordToggle.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    await signInPage.showPasswordToggle.click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("User can go to Reset Password page", async ({ page }) => {
    const signInPage = newSignInPage(page);

    await signInPage.forgotPasswordLink.click();
    await page.waitForURL("**/auth/pwreset/email");

    expect(page.url()).toContain("/auth/pwreset/email");
  });

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
          color: COLOR.RED,
          progress: PROGRESS.P20,
        },
      },
      {
        password: "Activis",
        expected: {
          text: RATING.WEAK,
          color: COLOR.ORANGE,
          progress: PROGRESS.P40,
        },
      },
      {
        password: "Activist4Climat",
        expected: {
          text: RATING.MEDIUM,
          color: COLOR.YELLOW,
          progress: PROGRESS.P60,
        },
      },
      {
        password: "Activist4ClimateChange",
        expected: {
          text: RATING.STRONG,
          color: COLOR.GREEN,
          progress: PROGRESS.P80,
        },
      },
      {
        password: "Activist4ClimateChange!",
        expected: {
          text: RATING.VERY_STRONG,
          color: COLOR.PRIMARY_TEXT,
          progress: PROGRESS.P100,
        },
      },
      {
        password: "",
        expected: {
          text: RATING.INVALID,
          color: COLOR.NONE,
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

  test("Page displays captcha", async ({ page }) => {
    const signInPage = newSignInPage(page);

    await expect(signInPage.captcha).toBeVisible();
  });

  test("User can sign in and go to home page", async ({ page }) => {
    const signInPage = newSignInPage(page);

    await signInPage.usernameInput.fill("admin");
    await signInPage.passwordInput.fill("admin");

    // Click CAPTCHA if present
    const captcha = signInPage.captcha;
    if (await captcha.isVisible()) {
      await captcha.click();
    }

    await signInPage.signInButton.click();

    await page.waitForURL("**/home");
    expect(page.url()).toContain("/home");
    // Should be redirected to the home page AND sidebar left should have create button.
  });

  test("Page shows error for invalid credentials", async ({ page }) => {
    const signInPage = newSignInPage(page);

    await signInPage.usernameInput.fill("invaliduser");
    await signInPage.passwordInput.fill("invaliduser");

    // Click CAPTCHA if present
    const captcha = signInPage.captcha;
    if (await captcha.isVisible()) {
      await captcha.click();
    }

    await signInPage.signInButton.click();

    // Wait for error toast to appear
    const errorToast = page.locator('[data-sonner-toast][data-type="error"]');
    await expect(errorToast).toBeVisible();

    // Verify error message content
    await expect(errorToast).toContainText(/invalid username or password/i);

    // Verify we stay on sign-in page
    expect(page.url()).toContain("/auth/sign-in");
  });

  test("User will have token saved in cookie", async ({ page }, testInfo) => {
    logTestPath(testInfo);
    const signInPage = newSignInPage(page);

    await withTestStep(testInfo, "Fill in credentials", async () => {
      await signInPage.usernameInput.fill("admin");
      await signInPage.passwordInput.fill("admin");
    });

    await withTestStep(testInfo, "Handle CAPTCHA if present", async () => {
      const captcha = signInPage.captcha;
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
});

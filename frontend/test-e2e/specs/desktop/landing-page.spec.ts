// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";
import { LOCALE_CODE, LOCALE_NAME } from "~/locales";
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import {
  ROADMAP_LINK_NAME,
  SIGN_IN_LINK_NAME,
  SIGN_UP_LINK_NAME,
} from "~/test-e2e/accessibility/accessible-names";
import { expectTheme } from "~/test-e2e/assertions";
import { newLanguageMenu } from "~/test-e2e/component-objects/LanguageMenu";
import { newThemeMenu } from "~/test-e2e/component-objects/ThemeMenu";
import { newLandingPage } from "~/test-e2e/page-objects/LandingPage";
import { getEnglishText } from "~/utils/i18n";

test.beforeEach(async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    new RegExp(getEnglishText("i18n.components.landing_splash.header"), "i")
  );
});

test.describe("Landing Page", { tag: "@desktop" }, () => {
  test("User can go to Roadmap on desktop", async ({ page }) => {
    await page.getByRole("link", { name: ROADMAP_LINK_NAME }).click();
    await page.waitForURL("**/about/roadmap");

    expect(page.url()).toContain("/about/roadmap");
  });

  test("User can go to Sign In page", async ({ page }) => {
    await page.getByRole("link", { name: SIGN_IN_LINK_NAME }).click();
    await page.waitForURL("**/auth/sign-in");

    expect(page.url()).toContain("/auth/sign-in");
  });

  test("User can go to Sign Up page", async ({ page }) => {
    await page.getByRole("link", { name: SIGN_UP_LINK_NAME }).click();
    await page.waitForURL("**/auth/sign-up");

    expect(page.url()).toContain("/auth/sign-up");
  });

  test("User can change theme", async ({ page }) => {
    const themeMenu = newThemeMenu(page);
    const themes = [
      {
        theme: "dark",
        option: themeMenu.darkThemeOption,
      },
      {
        theme: "light",
        option: themeMenu.lightThemeOption,
      },
    ];

    for (const { theme, option } of themes) {
      await themeMenu.toggleOpenButton.click();
      await option.click();

      await expectTheme(page, theme);

      await expect(
        themeMenu.systemThemeOption,
        "Theme menu should close after select"
      ).not.toBeVisible();
    }
  });

  test("User can change language", async ({ page }) => {
    const languages = [
      {
        code: LOCALE_CODE.SPANISH,
        path: LOCALE_CODE.SPANISH,
        option: LOCALE_NAME.SPANISH,
      },
      {
        code: LOCALE_CODE.GERMAN,
        path: LOCALE_CODE.GERMAN,
        option: LOCALE_NAME.GERMAN,
      },
      {
        code: LOCALE_CODE.FRENCH,
        path: LOCALE_CODE.FRENCH,
        option: LOCALE_NAME.FRENCH,
      },
      {
        code: LOCALE_CODE.PORTUGUESE,
        path: LOCALE_CODE.PORTUGUESE,
        option: LOCALE_NAME.PORTUGUESE,
      },
      {
        code: LOCALE_CODE.ENGLISH,
        path: "",
        option: LOCALE_NAME.ENGLISH,
      },
    ];

    let currentLocale: LOCALE_CODE = LOCALE_CODE.ENGLISH;

    for (const { code, path, option } of languages) {
      const languageMenu = newLanguageMenu(page, currentLocale);
      await languageMenu.toggleOpenButton.click();

      await languageMenu.menu.getByRole("link", { name: option }).click();
      currentLocale = code;

      await page.waitForURL(`**/${path}`);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        newLandingPage(code).headingText
      );
    }
  });

  // MARK: Accessibility

  // Note: Check to make sure that this is eventually done for light and dark modes.
  test.fail(
    "Landing Page has no detectable accessibility issues",
    async ({ page }, testInfo) => {
      const violations = await runAccessibilityTest(
        "Landing Page",
        page,
        testInfo
      );
      expect
        .soft(violations, "Accessibility violations found:")
        .toHaveLength(0);

      if (violations.length > 0) {
        console.log(
          "Accessibility violations:",
          JSON.stringify(violations, null, 2)
        );
      }
    }
  );
});

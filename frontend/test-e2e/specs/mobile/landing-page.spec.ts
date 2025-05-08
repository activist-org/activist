// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { LOCALE_CODE, LOCALE_NAME } from "~/locales";
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { ROADMAP_LINK_NAME } from "~/test-e2e/accessibility/accessible-names";
import { expectTheme } from "~/test-e2e/assertions";
import { newLanguageMenu } from "~/test-e2e/component-objects/LanguageMenu";
import { newSidebarRight } from "~/test-e2e/component-objects/SidebarRight";
import { newSignInMenu } from "~/test-e2e/component-objects/SignInMenu";
import { newThemeMenu } from "~/test-e2e/component-objects/ThemeMenu";
import { newLandingPage } from "~/test-e2e/page-objects/LandingPage";
import { getEnglishText } from "~/utils/i18n";

test.beforeEach(async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    new RegExp(getEnglishText("i18n.components.landing_splash.header"), "i")
  );
});

test.describe("Landing Page", { tag: "@mobile" }, () => {
  test("User can go to the docs from the landing page", async ({ page }) => {
    // Check for at least one link to the docs site.
    const docsLinks = page
      .getByRole("link", { name: /.*/ })
      .filter({ hasText: /.*/ });

    // Find if any link points to docs.activist.org/activist.
    const docsLinkCount = await docsLinks.evaluateAll(
      (links) =>
        links.filter((link) =>
          (link as HTMLAnchorElement).href.includes(
            "https://docs.activist.org/activist"
          )
        ).length
    );

    // Assert that at least one matching link exists.
    expect(docsLinkCount).toBe(13);
  });

  test("Roadmap link is not in mobile layout", async ({ page }) => {
    expect(
      page.getByRole("link", { name: ROADMAP_LINK_NAME })
    ).not.toBeAttached();
  });

  test("User can go to Sign In page", async ({ page }) => {
    const sidebar = newSidebarRight(page);
    await sidebar.openButton.click();

    const signInMenu = newSignInMenu(page);
    await signInMenu.toggleOpenButton.click();
    await signInMenu.signInOption.click();

    await page.waitForURL("**/auth/sign-in");
    expect(page.url()).toContain("/auth/sign-in");
  });

  test("User can go to Sign Up page", async ({ page }) => {
    const sidebar = newSidebarRight(page);
    await sidebar.openButton.click();

    const signInMenu = newSignInMenu(page);
    await signInMenu.toggleOpenButton.click();
    await signInMenu.signUpOption.click();

    await page.waitForURL("**/auth/sign-up");
    expect(page.url()).toContain("/auth/sign-up");
  });

  test("User can change theme", async ({ page }) => {
    const sidebar = newSidebarRight(page);
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
      await sidebar.openButton.click();
      await expect(themeMenu.toggleOpenButton).toBeVisible();
      await themeMenu.toggleOpenButton.click();
      await expect(themeMenu.menu).toBeVisible();
      await option.click();

      await expectTheme(page, theme);

      await sidebar.closeButton.click();
      await expect(
        themeMenu.systemThemeOption,
        "Theme menu should be closed"
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
      const sidebar = newSidebarRight(page, currentLocale);
      await sidebar.openButton.click();

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
  test("Landing Page has no detectable accessibility issues", async ({
    page,
  }, testInfo) => {
    const violations = await runAccessibilityTest(
      "Landing Page",
      page,
      testInfo
    );
    expect.soft(violations, "Accessibility violations found:").toHaveLength(0);

    if (violations.length > 0) {
      console.log(
        "Accessibility violations:",
        JSON.stringify(violations, null, 2)
      );
    }
  });
});

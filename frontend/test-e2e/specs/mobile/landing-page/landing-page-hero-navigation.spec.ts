// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  ACTIVIST_SECTION_LEARN_MORE_LINK_NAME,
  GET_ACTIVE_LEARN_MORE_LINK_NAME,
  GET_ORGANIZED_LEARN_MORE_LINK_NAME,
  GROW_ORGANIZATION_LEARN_MORE_LINK_NAME,
  ROADMAP_LINK_NAME,
} from "~/test-e2e/accessibility/accessible-names";
import { expectTheme } from "~/test-e2e/assertions";
import { newLanguageMenu } from "~/test-e2e/component-objects/LanguageMenu";
import { newSidebarRight } from "~/test-e2e/component-objects/SidebarRight";
import { newSignInMenu } from "~/test-e2e/component-objects/SignInMenu";
import { newThemeMenu } from "~/test-e2e/component-objects/ThemeMenu";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newLandingPage } from "~/test-e2e/page-objects/LandingPage";
import { getEnglishText } from "~/utils/i18n";
import { LOCALE_CODE, LOCALE_NAME } from "~/utils/locales";

test.describe(
  "Landing Page - Hero & Navigation",
  { tag: ["@mobile", "@unauth"] },
  () => {
    // Override to run without authentication (landing page for unauthenticated users).
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ page, context }) => {
      // Clear all cookies and local storage to ensure completely unauthenticated state.
      await context.clearCookies();
      await page.goto("/en");
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        new RegExp(getEnglishText("i18n.components.landing_splash.header"), "i")
      );
    });

    // MARK: Hero Navigation

    test("User can go to Learn More page from Get Active learn more link", async ({
      page,
    }) => {
      await page
        .getByRole("link", { name: GET_ACTIVE_LEARN_MORE_LINK_NAME })
        .click();
      await page.waitForURL("**/activist");

      expect(page.url()).toContain("/activist");
    });

    test("User can go to Learn More page from Get Organized learn more link", async ({
      page,
    }) => {
      await page
        .getByRole("link", { name: GET_ORGANIZED_LEARN_MORE_LINK_NAME })
        .click();
      await page.waitForURL("**/activist");

      expect(page.url()).toContain("/activist");
    });

    test("User can go to Learn More page from Grow Organization learn more link", async ({
      page,
    }) => {
      await page
        .getByRole("link", { name: GROW_ORGANIZATION_LEARN_MORE_LINK_NAME })
        .click();
      await page.waitForURL("**/activist");

      expect(page.url()).toContain("/activist");
    });

    test("User can go to Learn More page from activist section learn more link", async ({
      page,
    }) => {
      await page
        .getByRole("link", { name: ACTIVIST_SECTION_LEARN_MORE_LINK_NAME })
        .click();
      await page.waitForURL("**/activist");

      expect(page.url()).toContain("/activist");
    });

    test("Roadmap link is not in mobile layout", async ({ page }) => {
      expect(
        page.getByRole("link", { name: ROADMAP_LINK_NAME })
      ).not.toBeAttached();
    });

    // MARK: Authentication

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

    // MARK: Theme & Language

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

        await sidebar.closeButton.click({ force: true });
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
          newLandingPage(code).headingText ?? ""
        );
      }
    });
  }
);

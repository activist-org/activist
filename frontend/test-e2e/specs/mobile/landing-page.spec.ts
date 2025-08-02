// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { LOCALE_CODE, LOCALE_NAME } from "~/locales";
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import {
  ACTIVIST_SECTION_LEARN_MORE_LINK_NAME,
  FOOTER_ABOUT_LINK_NAME,
  FOOTER_DOCUMENTATION_LINK_NAME,
  FOOTER_IMPRINT_LINK_NAME,
  FOOTER_PRIVACY_LINK_NAME,
  FOOTER_ROADMAP_LINK_NAME,
  FOOTER_SUPPORTERS_LINK_NAME,
  FOOTER_TRADEMARK_LINK_NAME,
  GET_ACTIVE_LEARN_MORE_LINK_NAME,
  GET_ORGANIZED_LEARN_MORE_LINK_NAME,
  GROW_ORGANIZATION_LEARN_MORE_LINK_NAME,
  OUR_SUPPORTERS_BECOME_LINK_NAME,
  OUR_SUPPORTERS_VIEW_LINK_NAME,
  ROADMAP_LINK_NAME,
} from "~/test-e2e/accessibility/accessible-names";
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

  test("User can go to Learn More page from Activist section learn more link", async ({
    page,
  }) => {
    await page
      .getByRole("link", { name: ACTIVIST_SECTION_LEARN_MORE_LINK_NAME })
      .click();
    await page.waitForURL("**/activist");

    expect(page.url()).toContain("/activist");
  });

  test("User can go to Support Us page from Become a Supporter button", async ({
    page,
  }) => {
    await page
      .getByRole("link", { name: OUR_SUPPORTERS_BECOME_LINK_NAME })
      .click();
    await page.waitForURL("**/welcome/support-us");

    expect(page.url()).toContain("/welcome/support-us");
  });

  test("User can go to Supporters page from View all Supporters button", async ({
    page,
  }) => {
    await page
      .getByRole("link", { name: OUR_SUPPORTERS_VIEW_LINK_NAME })
      .click();
    await page.waitForURL("**/organization/community/supporters");

    expect(page.url()).toContain("/organization/community/supporters");
  });

  test("User can go to Roadmap page from Footer link", async ({ page }) => {
    await page.getByRole("link", { name: FOOTER_ROADMAP_LINK_NAME }).click();
    await page.waitForURL("**/product/about/roadmap");

    expect(page.url()).toContain("/product/about/roadmap");
  });

  // Socials banner, open-source section and footer twice in source code and community section.
  test("There are four links to the activist GitHub on the landing page", async ({
    page,
  }) => {
    const landingPageLinks = page
      .getByRole("link", { name: /.*/ })
      .filter({ hasText: /.*/ });

    const GitHubLinkCount = await landingPageLinks.evaluateAll(
      (links) =>
        links.filter(
          (link) =>
            (link as HTMLAnchorElement).href ===
            "https://github.com/activist-org/activist"
        ).length
    );

    expect(GitHubLinkCount).toBe(4);
  });

  // Socials banner and footer.
  test("There are two links to the activist public Matrix community on the landing page", async ({
    page,
  }) => {
    const landingPageLinks = page
      .getByRole("link", { name: /.*/ })
      .filter({ hasText: /.*/ });

    const MatrixLinkCount = await landingPageLinks.evaluateAll(
      (links) =>
        links.filter((link) =>
          (link as HTMLAnchorElement).href.includes(
            "https://matrix.to/#/#activist_community:matrix.org"
          )
        ).length
    );

    expect(MatrixLinkCount).toBe(2);
  });

  // Socials banner and footer.
  test("There are two links to the activist Instagram on the landing page", async ({
    page,
  }) => {
    const landingPageLinks = page
      .getByRole("link", { name: /.*/ })
      .filter({ hasText: /.*/ });

    const InstagramLinkCount = await landingPageLinks.evaluateAll(
      (links) =>
        links.filter((link) =>
          (link as HTMLAnchorElement).href.includes(
            "https://instagram.com/activist_org"
          )
        ).length
    );

    expect(InstagramLinkCount).toBe(2);
  });

  test("User can go to Documentation from Footer link", async ({ page }) => {
    await page
      .getByRole("link", { name: FOOTER_DOCUMENTATION_LINK_NAME })
      .click();
    await page.waitForURL("**/activist");

    expect(page.url()).toContain("/activist");
  });

  test("User can go to About page from Footer link", async ({ page }) => {
    await page.getByRole("link", { name: FOOTER_ABOUT_LINK_NAME }).click();
    await page.waitForURL("**/organization/community");

    expect(page.url()).toContain("/organization/community");
  });

  test("User can go to Supporters page from Footer link", async ({ page }) => {
    await page.getByRole("link", { name: FOOTER_SUPPORTERS_LINK_NAME }).click();
    await page.waitForURL("**/organization/community/supporters");

    expect(page.url()).toContain("/organization/community/supporters");
  });

  test("User can go to Imprint page from Footer link", async ({ page }) => {
    await page.getByRole("link", { name: FOOTER_IMPRINT_LINK_NAME }).click();
    await page.waitForURL("**/organization/legal/imprint");

    expect(page.url()).toContain("/organization/legal/imprint");
  });

  test("User can go to Trademark page from Footer link", async ({ page }) => {
    await page.getByRole("link", { name: FOOTER_TRADEMARK_LINK_NAME }).click();
    await page.waitForURL("**/organization/legal/trademark");

    expect(page.url()).toContain("/organization/legal/trademark");
  });

  test("User can go to Privacy Policy page from Footer link", async ({
    page,
  }) => {
    await page.getByRole("link", { name: FOOTER_PRIVACY_LINK_NAME }).click();
    await page.waitForURL("**/product/data-and-security/privacy-policy");

    expect(page.url()).toContain("/product/data-and-security/privacy-policy");
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
      // Note: For future implementation.
    }
  });
});

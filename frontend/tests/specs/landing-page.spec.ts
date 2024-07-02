import AxeBuilder from "@axe-core/playwright";
import locales from "../../locales";
import { LandingPage, expect, test } from "../fixtures/page-fixtures";

test.describe("Landing Page", () => {
  // Initialize page before each test, wait for the landing splash to be visible.
  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto("/en");
    const { landingSplash } = landingPage;
    await landingSplash.waitFor({ state: "visible" });
  });

  /* *********************************************************** */
  /* HEADER TESTS */
  /* *********************************************************** */

  // Test that Header is visible if the viewport is large enough.
  test("Header should be visible", async ({ landingPage }) => {
    if (!(await landingPage.isMobile())) {
      const { desktopHeader } = landingPage.header;
      await expect(desktopHeader).toBeVisible();
    } else {
      const { mobileHeader } = landingPage.header;
      await expect(mobileHeader).toBeVisible();
    }
  });

  // Test that the Header is visible on both mobile and desktop.
  test("Header visibility on mobile and desktop", async ({ landingPage }) => {
    const headerVisibility = (await landingPage.isMobile())
      ? landingPage.header.mobileHeader
      : landingPage.header.desktopHeader;
    await expect(headerVisibility).toBeVisible();
  });

  // Test that the Roadmap button is visible and clickable only on Desktop.
  test("Roadmap button should be visible and clickable only on Desktop", async ({
    landingPage,
  }) => {
    if (!(await landingPage.isMobile())) {
      await expect(landingPage.header.roadmapButton).toBeVisible();
      await landingPage.header.navigateToRoadmap();
      await landingPage.waitForUrlChange("**/about/roadmap");
      expect(landingPage.getPage.url()).toContain("/about/roadmap");
    } else {
      await expect(landingPage.header.roadmapButton).toBeHidden();
    }
  });

  // Test that the Get In Touch button is visible and clickable on Desktop.
  test("Get In Touch button is functional", async ({ landingPage }) => {
    if (!(await landingPage.isMobile())) {
      await expect(landingPage.header.getInTouchButton).toBeVisible();
      await landingPage.header.getInTouchButton.click();
      await landingPage.waitForUrlChange("**/contact");
      expect(landingPage.getPage.url()).toContain("/contact");
    } else {
      await expect(landingPage.header.getInTouchButton).toBeHidden();
    }
  });

  // Test that the theme dropdown is visible and functional.
  test("Theme dropdown is functional", async ({ landingPage }) => {
    const themes = ["light", "dark"];
    for (const theme of themes) {
      await landingPage.header.selectThemeOption(theme);
      const currentTheme = await landingPage.currentTheme();
      expect(currentTheme).toContain(theme);
    }
  });

  // Test that the language dropdown is visible and functional.
  test("Language dropdown is functional", async ({ landingPage }) => {
    const selectedLanguage = await landingPage.header.getSelectedLanguage();
    const languageOptions = await landingPage.header.getLanguageOptions();

    for (const locale of locales) {
      if (locale.code === selectedLanguage) {
        continue;
      }
      const optionText = locale.name;
      const option = await landingPage.header.findLanguageOption(
        languageOptions,
        optionText
      );
      const langOptionIsVisible = await option?.isVisible();
      expect(langOptionIsVisible).toBe(true);
    }
  });

  /* *********************************************************** */
  /* ACCESSIBILITY TESTS */
  /* *********************************************************** */

  // Test accessibility of the landing page (skip this test for now).
  // Note: Check to make sure that this is eventually done for light and dark modes.
  test.skip("There are no detectable accessibility issues", async ({
    landingPage,
  }, testInfo) => {
    const results = await new AxeBuilder({ page: landingPage.getPage })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    await testInfo.attach("accessibility-scan-results", {
      body: JSON.stringify(results, null, 2),
      contentType: "application/json",
    });

    expect(results.violations).toEqual([]);
  });

  /* *********************************************************** */
  /* LANDING PAGE TESTS */
  /* *********************************************************** */

  test('Title should contain "activist"', async ({ landingPage }) => {
    const pageTitle = await landingPage.getPage.title();
    expect(pageTitle).toContain("activist");
  });

  test("Splash should contain the request access link", async ({
    landingPage,
  }) => {
    const { requestAccessLink } = landingPage;
    expect(await requestAccessLink.getAttribute("href")).toBe(
      LandingPage.urls.REQUEST_ACCESS_URL
    );
  });

  test("All important links should be visible on the landing page", async ({
    landingPage,
  }) => {
    await expect(landingPage.landingSplash).toBeVisible();
    await expect(landingPage.requestAccessLink).toBeVisible();
    await expect(landingPage.getActiveButton).toBeVisible();
    await expect(landingPage.getOrganizedButton).toBeVisible();
    await expect(landingPage.growOrganizationButton).toBeVisible();
    await expect(landingPage.aboutButton).toBeVisible();
    await expect(landingPage.ourSupportersButton).toBeVisible();
  });
});

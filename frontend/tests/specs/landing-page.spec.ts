import AxeBuilder from "@axe-core/playwright";
import { LandingPage, expect, test } from "../fixtures/page-fixtures";

test.describe("Landing Page", () => {
  // Initialize page before each test, wait for the landing splash to be visible.
  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto("/en");
    const landingSplash = landingPage.landingSplash;
    await landingSplash.waitFor({ state: "visible" });
  });

  /* *********************************************************** */
  /* HEADER TESTS */
  /* *********************************************************** */

  // Test that Header is visible if the viewport is large enough.
  test("Header should be visible", async ({ landingPage }) => {
    if (!(await landingPage.isMobile())) {
      const desktopHeader = landingPage.header.desktopHeader;
      await expect(desktopHeader).toBeVisible();
    } else {
      const mobileHeader = landingPage.header.mobileHeader;
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
    const themeDropdown = landingPage.header.themeDropdown;
    await expect(themeDropdown).toBeVisible();
    await landingPage.header.selectThemeOption("Light");
    expect(await landingPage.getPage.getAttribute("html", "class")).toBe(
      "light"
    );
    await landingPage.header.selectThemeOption("Dark");
    expect(await landingPage.getPage.getAttribute("html", "class")).toBe(
      "dark"
    );
  });

  // Test that the language dropdown is visible and functional.
  test("Language dropdown is functional", async ({ landingPage }) => {
    const languageDropdown = landingPage.header.languageDropdown;
    await expect(languageDropdown).toBeVisible();
    await landingPage.header.selectLanguageOption("English");
    await landingPage.header.selectLanguageOption("Español");
  });

  /* *********************************************************** */
  /* ACCESSIBILITY TESTS */
  /* *********************************************************** */

  // Test accessibility of the landing page (skip this test for now).
  test.skip("should not have any detectable accessibility issues", async ({
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

  test('title should contain "activist"', async ({ landingPage }) => {
    const pageTitle = await landingPage.getPage.title();
    console.log("Page Title:", pageTitle);
    expect(pageTitle).toContain("activist");
  });

  test("should contain the request access link", async ({ landingPage }) => {
    const requestAccessLink = landingPage.requestAccessLink;
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

// SPDX-License-Identifier: AGPL-3.0-or-later
import { LandingPage, expect, test } from "../fixtures/test-fixtures";
import { runAccessibilityTest } from "../utils/accessibilityTesting";

test.describe("Landing Page", () => {
  // MARK: Header

  // Test that the correct Header is visible on mobile or desktop.
  test("The correct header element should be visible on mobile and desktop", async ({
    landingPage,
  }) => {
    const header = await landingPage.getVisibleHeader();
    await expect(header).toBeVisible();
  });

  // Test that the Roadmap button is visible and clickable only on Desktop Header.
  test("Roadmap button should be visible and clickable only on Desktop", async ({
    landingPage,
  }) => {
    const result = await landingPage.checkRoadmapButtonVisibility();
    expect(result).toBe(true);
  });

  // Test that the Sign In link can be accessed from the Home Page.
  test("Sign In link should be accessible from the Home Page", async ({
    landingPage,
  }) => {
    const isSignInVisible = await landingPage.isSignInButtonVisible();
    expect(isSignInVisible).toBe(true);

    await landingPage.navigateToSignIn();
    expect(landingPage.url()).toContain("/auth/sign-in");
  });

  // Test that the Sign Up link can be accessed from the Home Page.
  test("Sign Up link should be accessible from the Home Page", async ({
    landingPage,
  }) => {
    const isSignUpVisible = await landingPage.isSignUpButtonVisible();
    expect(isSignUpVisible).toBe(true);

    await landingPage.navigateToSignUp();
    expect(landingPage.url()).toContain("/auth/sign-up");
  });

  // Test that the theme dropdown is visible and functional.
  test("Theme dropdown is functional", async ({ landingPage }) => {
    const themes = ["light", "dark"];

    for (const theme of themes) {
      await landingPage.selectThemeOption(theme);
      const currentTheme = await landingPage.currentTheme();
      expect(currentTheme).toContain(theme);
    }
  });

  // Test that the language dropdown is visible and functional.
  test("Language dropdown options are visible", async ({ landingPage }) => {
    const visibleOptions = await landingPage.getVisibleLanguageOptions();
    expect(visibleOptions.length).toBeGreaterThan(0);
    for (const option of visibleOptions) {
      await expect(option).toBeVisible();
    }
  });

  // MARK: Landing Page

  // Test that the title of the landing page contains "activist".
  test('Title should contain "activist"', async ({ landingPage }) => {
    const pageTitle = await landingPage.title();
    expect(pageTitle).toContain("activist");
  });

  // Test that the landing page contains the request access link.
  test.skip("Splash should contain the request access link", async ({
    landingPage,
  }) => {
    const requestAccessLink = landingPage.requestAccessLink;
    expect(await requestAccessLink.getAttribute("href")).toBe(
      LandingPage.urls.REQUEST_ACCESS_URL
    );
  });

  // Test that the view organizations button is visible and navigates to the organizations page.
  test("View organizations button should be visible and functional", async ({
    landingPage,
  }) => {
    const isVisible = await landingPage.isViewOrganizationsButtonVisible();
    expect(isVisible).toBe(true);

    await landingPage.navigateToViewOrganizations();
    expect(landingPage.url()).toContain("/organizations");
  });

  // Test that the view events button is visible and navigates to the events page.
  test("View events button should be visible and functional", async ({
    landingPage,
  }) => {
    const isVisible = await landingPage.isViewEventsButtonVisible();
    expect(isVisible).toBe(true);

    await landingPage.navigateToViewEvents();
    expect(landingPage.url()).toContain("/events");
  });

  // Test that all important links are visible on the landing page.
  test("All important links should be visible on the landing page", async ({
    landingPage,
  }) => {
    const importantLinks = await landingPage.getImportantLinks();
    for (const link of importantLinks) {
      await expect(link).toBeVisible();
    }
  });

  // MARK: Accessibility

  // Note: Check to make sure that this is eventually done for light and dark modes.
  test("Landing Page has no detectable accessibility issues", async ({
    landingPage,
  }, testInfo) => {
    const violations = await runAccessibilityTest(landingPage, testInfo);
    expect.soft(violations, "Accessibility violations found:").toHaveLength(0);

    if (violations.length > 0) {
      console.log(
        "Accessibility violations:",
        JSON.stringify(violations, null, 2)
      );
    }
  });
});

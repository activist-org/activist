import AxeBuilder from "@axe-core/playwright";
import { LandingPage, expect, test } from "../fixtures/page-fixtures";

test.describe("Landing Page", () => {
  // Initialize page before each test, wait for the landing splash to be visible.
  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto("/en");
    const landingSplash = await landingPage.getLocator("LANDING_SPLASH");
    await landingSplash.waitFor({ state: "visible" });
  });

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

  test('title should contain "activist"', async ({ landingPage }) => {
    const pageTitle = await landingPage.getPage.title();
    console.log("Page Title:", pageTitle);
    expect(pageTitle).toContain("activist");
  });

  test("should contain the request access link", async ({ landingPage }) => {
    const requestAccessLink = await landingPage.getLocator(
      "REQUEST_ACCESS_LINK"
    );
    expect(await requestAccessLink.getAttribute("href")).toBe(
      LandingPage.urls.REQUEST_ACCESS_URL
    );
  });

  test("All important links should be visible on the landing page", async ({
    landingPage,
  }) => {
    for (const key in LandingPage.locators) {
      const locator = landingPage.getLocator(
        key as keyof typeof LandingPage.locators
      );
      await expect(locator).toBeVisible();
    }
  });
});

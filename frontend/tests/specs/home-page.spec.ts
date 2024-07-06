import AxeBuilder from "@axe-core/playwright";
import { HomePage, expect, test } from "../fixtures/page-fixtures";

test.describe("Home Page", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto("/home");
    const { topicsDropdown } = homePage.topicsDropdown;
    await topicsDropdown.waitFor({ state: "visible" });
  });

  /* *********************************************************** */
  /* ACCESSIBILITY TESTS */
  /* *********************************************************** */

  // Test accessibility of the home page (skip this test for now).
  // Note: Check to make sure that this is eventually done for light and dark modes.
  test.skip("There are no detectable accessibility issues", async ({
    homePage,
  }, testInfo) => {
    const results = await new AxeBuilder({ page: homePage.getPage })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    await testInfo.attach("accessibility-scan-results", {
      body: JSON.stringify(results, null, 2),
      contentType: "application/json",
    });

    expect(results.violations).toEqual([]);
  });

  test("The topics dropdown should be functional", async ({ homePage }) => {
    await homePage.topicsDropdown.openTopicsDropdown();
    await expect(homePage.topicsDropdown.topicsOptions).toBeVisible();
    await homePage.topicsDropdown.closeTopicsDropdown();
    await expect(homePage.topicsDropdown.topicsOptions).toBeHidden();
  });
});

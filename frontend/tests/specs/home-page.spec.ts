import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "../fixtures/test-fixtures";

test.describe("Home Page", () => {
  // MARK: Accessibility

  // Note: Check to make sure that this is eventually done for light and dark modes.
  test("Home Page has no detectable accessibility issues", async ({
    homePage,
    isAccessibilityTest,
  }, testInfo) => {
    const violations = await runAccessibilityTest(homePage, testInfo);
    expect.soft(violations, "Accessibility violations found:").toHaveLength(0);

    if (violations.length > 0) {
      console.log(
        "Accessibility violations:",
        JSON.stringify(violations, null, 2)
      );
    }
  });

  test("The topics dropdown should be functional", async ({ homePage }) => {
    await homePage.checkTopicsDropdownFunctionality();
  });

  test("The sidebar should be visible on desktop", async ({ homePage }) => {
    const isMobile = await homePage.isMobile();
    test.skip(isMobile, "This test is only for desktop");

    const isVisible = await homePage.checkSidebarVisibilityOnDesktop();
    expect(isVisible).toBe(true);
  });

  test("The sidebar should expand and collapse when hovered over", async ({
    homePage,
  }) => {
    const results = await homePage.checkSidebarExpandCollapse();
    results.forEach((result) => expect(result).toBe(true));
  });

  test("Navigation dropdown menus should be functional", async ({
    homePage,
  }) => {
    const results = await homePage.checkNavigationMenus();
    results.forEach((result) => expect(result).toBe(true));
  });

  test("Navigation links should be functional", async ({ homePage }) => {
    const results = await homePage.checkNavigationLinks();
    const expectedPaths = [
      "/organizations",
      "/home",
      "/events",
      "/help",
      "/docs",
      "/legal",
      "/auth/sign-in",
      "/auth/sign-up",
    ];
    results.forEach((url, index) =>
      expect(url).toContain(expectedPaths[index])
    );
  });

  test("Hot keys should function correctly", async ({ homePage }) => {
    const isMobile = await homePage.isMobile();
    test.skip(isMobile, "This test is only for desktop");

    if (!isMobile) {
      const [
        isSearchInputFocused,
        isExpandedSearchInputVisible,
        isExpandedSearchInputHidden,
      ] = await homePage.checkHotKeyFunctionality();
      expect(isSearchInputFocused).toBe(true);
      expect(isExpandedSearchInputVisible).toBe(true);
      expect(isExpandedSearchInputHidden).toBe(true);
    }
  });

  test("Search bar should be functional on both mobile and desktop", async ({
    homePage,
  }) => {
    const results = await homePage.checkSearchFunctionality();
    expect(results).toEqual([true, true, true, true]);
  });
});

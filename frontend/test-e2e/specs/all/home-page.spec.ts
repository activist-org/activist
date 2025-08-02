// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { pressControlKey } from "~/test-e2e/actions/keyboard";
import { newSearchModal } from "~/test-e2e/component-objects/SearchModal";
import { newHomePage } from "~/test-e2e/page-objects/HomePage";

test.beforeEach(async ({ page }) => {
  await page.goto("/home");
  const { topicsFilter } = newHomePage(page);

  await expect(topicsFilter).toBeVisible({ timeout: 60000 });
});

test.describe("Home Page", { tag: ["@desktop", "@mobile"] }, () => {
  test("Topics filter should expand or hide on click", async ({ page }) => {
    const { topicsFilter } = newHomePage(page);
    await topicsFilter.click();
    await expect(topicsFilter.getByRole("listbox")).toBeVisible();

    await topicsFilter.click();
    await expect(topicsFilter.getByRole("listbox")).toBeHidden();
  });

  test("User can use search modal with CTRL+'K'", async ({ page }) => {
    const searchModal = newSearchModal(page);

    await pressControlKey(page, "K");
    await expect(searchModal.input).toBeVisible();

    await searchModal.input.fill("test search");
    await expect(searchModal.root).toContainText(
      /no results for: test search/i
    );

    await searchModal.closeButton.click();
    await expect(searchModal.root).not.toBeAttached();
  });

  // Note: Check to make sure that this is eventually done for light and dark modes.
  test.fail(
    "Home Page has no detectable accessibility issues",
    async ({ page }, testInfo) => {
      const violations = await runAccessibilityTest(
        "Home Page",
        page,
        testInfo
      );
      expect
        .soft(violations, "Accessibility violations found:")
        .toHaveLength(0);

      if (violations.length > 0) {
        // Note: For future implementation.
      }
    }
  );
});

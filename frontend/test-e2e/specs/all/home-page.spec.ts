import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { pressControlKey } from "~/test-e2e/actions/keyboard";
import { newSearchModal } from "~/test-e2e/component-objects/SearchModal";
// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "~/test-e2e/global-fixtures";
import { newHomePage } from "~/test-e2e/page-objects/HomePage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  await page.goto("/home");
  const { topicsFilter } = newHomePage(page);

  await expect(topicsFilter).toBeVisible({ timeout: 60000 });
});

test.describe("Home Page", { tag: ["@desktop", "@mobile"] }, () => {
  test("Topics filter should expand or hide on click", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const { topicsFilter } = newHomePage(page);

    await withTestStep(testInfo, "Click topics filter to expand", async () => {
      await topicsFilter.getByRole("button").click();
      await expect(topicsFilter.getByRole("listbox")).toBeVisible();
    });

    await withTestStep(testInfo, "Click topics filter to hide", async () => {
      await topicsFilter.getByRole("button").click();
      await expect(topicsFilter.getByRole("listbox")).toBeHidden();
    });
  });

  test("User can use search modal with CTRL+'K'", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const searchModal = newSearchModal(page);

    await withTestStep(testInfo, "Open search modal with CTRL+K", async () => {
      await pressControlKey(page, "K");
      await expect(searchModal.input).toBeVisible();
    });

    await withTestStep(
      testInfo,
      "Perform search and verify results",
      async () => {
        await searchModal.input.fill("test search");
        await expect(searchModal.root).toContainText(
          /no results for: test search/i
        );
      }
    );

    await withTestStep(testInfo, "Close search modal", async () => {
      await searchModal.closeButton.click();
      await expect(searchModal.root).not.toBeAttached();
    });
  });

  // Note: Check to make sure that this is eventually done for light and dark modes.
  test(
    "Home Page has no detectable accessibility issues",
    { tag: "@accessibility" },
    async ({ page }, testInfo) => {
      logTestPath(testInfo);

      await withTestStep(
        testInfo,
        "Wait for lang attribute to be set",
        async () => {
          await expect(page.locator("html")).toHaveAttribute(
            "lang",
            /^[a-z]{2}(-[A-Z]{2})?$/
          );
        }
      );

      await withTestStep(testInfo, "Run accessibility scan", async () => {
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
      });
    }
  );
});

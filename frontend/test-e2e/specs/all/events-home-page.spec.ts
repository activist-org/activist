// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";
import { getEnglishText } from "~/utils/i18n";

test.beforeEach(async ({ page }) => {
  await page.goto("/events?view=list");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/events/i);
});

test.describe("Events Home Page", { tag: ["@desktop", "@mobile"] }, () => {
  // Note: Check to make sure that this is eventually done for light and dark modes.
  test("Events Home Page has no detectable accessibility issues", async ({
    page,
  }, testInfo) => {
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
        "Events Home Page",
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
  });

  test("User can navigate to an event about page", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    await withTestStep(testInfo, "Click on first event", async () => {
      const eventImage = page
        .getByRole("link", {
          name: getEnglishText(
            "i18n.components.card_search_result_entity_event.navigate_to_event_aria_label"
          ),
        })
        .first();
      await eventImage.click();
    });

    await withTestStep(
      testInfo,
      "Verify navigation to event about page",
      async () => {
        await expect(page).toHaveURL(/.*\/events\/.*\/about/);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      }
    );
  });
});

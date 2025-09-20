// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";

test.beforeEach(async ({ page }) => {
  await page.goto("/events");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/events/i);
});

test.describe("Events Home Page", { tag: ["@desktop", "@mobile"] }, () => {
  // Note: Check to make sure that this is eventually done for light and dark modes.
  test.skip("Events Home Page has no detectable accessibility issues", async ({
    page,
  }, testInfo) => {
    const violations = await runAccessibilityTest(
      "Events Home Page",
      page,
      testInfo
    );
    expect.soft(violations, "Accessibility violations found:").toHaveLength(0);

    if (violations.length > 0) {
      // Note: For future implementation.
    }
  });

  test("User can navigate to an event about page", async ({ page }) => {
    const eventImage = page
      .getByRole("link", {
        name: getEnglishText(
          "i18n.components.card_search_result_entity_event.navigate_to_event_aria_label"
        ),
      })
      .first();

    await eventImage.click();

    // Verify navigation to event about page
    await expect(page).toHaveURL(/.*\/events\/.*\/about/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

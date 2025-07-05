// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { getEnglishText } from "~/utils/i18n";

test.beforeEach(async ({ page }) => {
  await page.goto("/events?view=list");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/events/i);
});

test.describe("Events Page", { tag: "@desktop" }, () => {
  test("User can navigate to an event about page", async ({ page }) => {
    const eventImage = page
      .getByRole("link", {
        name: getEnglishText(
          "i18n.components.card_search_result.navigate_to_event_aria_label"
        ),
      })
      .first();

    await eventImage.click();
    await page.waitForURL("**/events/**/about");
  });
});

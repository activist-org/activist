// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";
import { getEnglishText } from "~/utils/i18n";

test.beforeEach(async ({ page }) => {
  await page.goto("/events");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/events/i);
});

test.describe("Events Page", { tag: "@desktop" }, () => {
  // User can share the events page.
  test("User can share the event page", async ({ page }) => {
    const shareButton = page
      .getByRole("link", {
        name: getEnglishText(
          "i18n.components.card_search_result.navigate_to_event_aria_label"
        ),
      })
      .locator("xpath=following-sibling::div")
      .getByRole("button")
      .first();
    await shareButton.click();
    await expect(shareButton.locator("div.tooltip")).toBeVisible();
    await shareButton.locator("div.tooltip").locator("button").click();

    const shareModal = page.locator("#search-modal").first();
    await expect(shareModal).toBeVisible();
  });
});

// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/events");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /events/i
  );
});

test.describe("Events Page", { tag: "@mobile" }, () => {
  test("Share button opens in mobile share sheet", async ({ page }) => {
    const shareButton = page
      .getByRole("link", {
        name: /Navigate to the page for this event/i,
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

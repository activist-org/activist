// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";
import { newSearchbar } from "~/test-e2e/component-objects/Searchbar";
import { newMainNavOptions } from "~/test-e2e/component-objects/MainNavOptions";

test.beforeEach(async ({ page }) => {
  await page.goto("/organizations");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /organizations/i
  );
});

test.describe("Organizations Page", { tag: "@mobile" }, () => {
  test("User can open searchbar", async ({ page }) => {
    const searchbar = newSearchbar(page);

    await searchbar.openToggle.click();
    await expect(searchbar.input).toHaveAttribute("placeholder", /search/i);

    await searchbar.openToggle.click();
    await expect(searchbar.input).not.toBeVisible();
  });

  test("User can navigate through main options", async ({ page }) => {
    const { homeLink, eventsLink } = newMainNavOptions(page);

    const links = [
      { link: eventsLink, path: "/events" },
      { link: homeLink, path: "/home" },
    ];

    for (const { link, path } of links) {
      await link.click();
      await page.waitForURL(`**${path}`);
      expect(page.url()).toContain(path);
      await page.goto("/organizations");
    }
  });

  test("Share button opens in mobile share sheet", async ({ page }) => {
    const shareButton = page
      .getByRole("link", {
        name: /Navigate to the page for this organization/i,
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

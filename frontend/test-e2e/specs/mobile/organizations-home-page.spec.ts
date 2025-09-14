// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { newOrganizationsHomePage } from "~/test-e2e/page-objects/OrganizationsHomePage";

test.beforeEach(async ({ page }) => {
  await page.goto("/organizations");
  const organizationsHomePage = newOrganizationsHomePage(page);
  await expect(organizationsHomePage.heading).toHaveText(/organizations/i);
});

test.describe("Organizations Home Page", { tag: "@mobile" }, () => {
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

    const shareModal = page.locator("#modal").first();
    await expect(shareModal).toBeVisible();
  });
});

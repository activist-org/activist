// SPDX-License-Identifier: AGPL-3.0-or-later
import type { BrowserContext, Page } from "playwright/test";

import { chromium, expect, test } from "playwright/test";

let context: BrowserContext;
let page: Page;

test.beforeEach(async ({ browser }) => {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
  await page.goto("http://localhost:3000/organizations");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /organizations/i
  );
});

test.describe("Organizations Page", { tag: "@desktop" }, () => {
  test("User can share the organization page", async ({ page }) => {
    await page.goto("http://localhost:3000/organizations");
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
    await page.locator("BtnAction[label='shareButtonLabel']").click();
    const modal = page.locator("ModalSharePage");
    await expect(modal).toBeVisible();
    const facebookIcon = modal.locator(
      "BtnShareIcon[iconName='IconMap.FACEBOOK']"
    );
    const telegramIcon = modal.locator(
      "BtnShareIcon[iconName='IconMap.TELEGRAM']"
    );
    const mastodonIcon = modal.locator(
      "BtnShareIcon[iconName='IconMap.MASTODON']"
    );
    const instagramIcon = modal.locator(
      "BtnShareIcon[iconName='IconMap.INSTAGRAM']"
    );
    const messengerIcon = modal.locator(
      "BtnShareIcon[iconName='IconMap.MESSENGER']"
    );
    await expect(facebookIcon).toBeVisible();
    await expect(telegramIcon).toBeVisible();
    await expect(mastodonIcon).toBeVisible();
    await expect(instagramIcon).toBeVisible();
    await expect(messengerIcon).toBeVisible();
  });
});

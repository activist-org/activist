// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test, chromium } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";

let browser: any;
let context: any;
let page: any;
//testing for organization page and "share organization" button
test.beforeEach(async ({ browser }) => {
  browser = await chromium.launch({headless: false });
  context = await browser.newContext();
  page = await context.newPage();
  await page.goto("http://localhost:3000/organizations");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /organizations/i
  );


});

/*test('Homepage share functionality', async({page}) => {
  await page.goto('/organizations');
  await page.click('share organization');
  const modal = page.locator('ModalSharePage');
  await expect(modal).toBeVisible();
  const facebookIcon = page.locator('img[alt="Facebook icon"]');
  await expect(facebookIcon).toBeVisible();
})*/

test.describe("Organizations Page", { tag: ["@desktop", "@mobile"] }, () => {
  // Note: Check to make sure that this is eventually done for light and dark modes.
  test("Organizations Page has no detectable accessibility issues", async ({
    page,
  }, testInfo) => {
    const violations = await runAccessibilityTest(
      "Organizations Page",
      page,
      testInfo
    );
    expect.soft(violations, "Accessibility violations found:").toHaveLength(0);

    if (violations.length > 0) {
      console.log(
        "Accessibility violations:",
        JSON.stringify(violations, null, 2)
      );
    }
  });
});

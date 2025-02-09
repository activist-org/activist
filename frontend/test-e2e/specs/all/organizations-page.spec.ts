// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { pressControlKey } from "~/test-e2e/actions/keyboard";
import { newSearchModal } from "~/test-e2e/component-objects/SearchModal";

test.beforeEach(async ({ page }) => {
  await page.goto("/organizations");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /organizations/i
  );
});

test.describe("Organizations Page", { tag: ["@desktop", "@mobile"] }, () => {
  test('Page Title should have text: "Organizations"', async ({ page }) => {
    expect(await page.title()).toContain("Organizations");
  });

  test("User can use search modal with CTRL+'K'", async ({ page }) => {
    const searchModal = newSearchModal(page);

    await pressControlKey(page, "K");
    await expect(searchModal.input).toBeVisible();

    await searchModal.input.fill("test organization");
    await expect(searchModal.root).toContainText(
      /no results for: test organization/i
    );

    await searchModal.closeButton.click();
    await expect(searchModal.root).not.toBeAttached();
  });

  test("Topics filter should expand or hide on click", async ({ page }) => {
    const topicsFilter = page.locator("#topics-dropdown");
    await topicsFilter.click();
    await expect(topicsFilter.getByRole("listbox")).toBeVisible();

    await topicsFilter.click();
    await expect(topicsFilter.getByRole("listbox")).toBeHidden();
  });

  test("User can navigate to organization details", async ({ page }) => {
    // First card with organization link
    const organizationCard = page
      .getByRole("link", {
        name: /Navigate to the page for this organization/i,
      })
      .first();
    await organizationCard.click();

    await page.waitForURL("**/organizations/**/about");
    expect(page.url()).toMatch(/\/organizations\/[\w-]+/);
  });

  // User can share the organization page
  test("User can share the organization page", async ({ page }) => {
    const shareButton = page
      .getByRole("link", {
        name: /Navigate to the page for this organization/i,
      })
      .locator('xpath=following-sibling::div')
      .getByRole("button")
      .first();
    await shareButton.click();
    await expect(shareButton.locator('div.tooltip')).toBeVisible();
    await shareButton.locator('div.tooltip').locator('button').click();

    const shareModal = page.locator('#search-modal').first();
    await expect(shareModal).toBeVisible();
  });

  // Note: Check to make sure that this is eventually done for light and dark modes.
  test.fail(
    "Organizations Page has no detectable accessibility issues",
    async ({ page }, testInfo) => {
      const violations = await runAccessibilityTest(
        "Organizations Page",
        page,
        testInfo
      );
      expect
        .soft(violations, "Accessibility violations found:")
        .toHaveLength(0);

      if (violations.length > 0) {
        console.log(
          "Accessibility violations:",
          JSON.stringify(violations, null, 2)
        );
      }
    }
  );
});

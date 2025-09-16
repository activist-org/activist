// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { newOrganizationsHomePage } from "~/test-e2e/page-objects/OrganizationsHomePage";

test.beforeEach(async ({ page }) => {
  await page.goto("/organizations");
  const organizationsHomePage = newOrganizationsHomePage(page);
  await expect(organizationsHomePage.heading).toHaveText(/organizations/i);
});

test.describe("Organizations Home Page", { tag: "@mobile" }, () => {
  test("User can share the organization page on mobile", async ({ page }) => {
    const organizationsHomePage = newOrganizationsHomePage(page);

    await organizationsHomePage.shareButton.click();
    await expect(
      organizationsHomePage.tooltip(organizationsHomePage.shareButton)
    ).toBeVisible();
    await organizationsHomePage
      .tooltipButton(organizationsHomePage.shareButton)
      .click();

    await expect(organizationsHomePage.shareModal).toBeVisible();

    // Close the modal by clicking the close button
    const closeModalButton = organizationsHomePage.closeModalButton(
      organizationsHomePage.shareModal
    );
    await expect(closeModalButton).toBeVisible();
    await closeModalButton.click({ force: true });

    // Expect the modal to not be visible
    await expect(organizationsHomePage.shareModal).not.toBeVisible();
  });
  // Skip this test until topic filtering functionality is implemented
  // Currently the combobox UI works but doesn't actually filter the organizations displayed
  test.skip("User can filter organizations by topic on mobile", async ({
    page,
  }) => {
    const organizationsHomePage = newOrganizationsHomePage(page);

    // Verify all organizations are initially visible
    await expect(page.locator('[data-testid="organization-card"]')).toHaveCount(
      9
    );

    // Filter by Environment topic
    await organizationsHomePage.comboboxButton.click();
    await page.getByRole("option", { name: "Environment" }).click();

    // Verify only environment organizations are shown (should be 1 card)
    await expect(page.locator('[data-testid="organization-card"]')).toHaveCount(
      1
    );

    // Reset filter to show all organizations again
    await organizationsHomePage.comboboxButton.click();
    await page.getByRole("option", { name: /all topics/i }).click();
    await expect(page.locator('[data-testid="organization-card"]')).toHaveCount(
      9
    );
  });
});

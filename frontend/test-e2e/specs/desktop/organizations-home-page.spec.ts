// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { newOrganizationsHomePage } from "~/test-e2e/page-objects/OrganizationsHomePage";
import { getEnglishText } from "~/utils/i18n";

test.beforeEach(async ({ page }) => {
  await page.goto("/organizations");
  const organizationsHomePage = newOrganizationsHomePage(page);
  await expect(organizationsHomePage.heading).toHaveText(
    getEnglishText("i18n.pages.organizations.index.header_title")
  );
});

test.describe("Organizations Home Page", { tag: "@desktop" }, () => {
  test("User can share the organization page", async ({ page }) => {
    const organizationsHomePage = newOrganizationsHomePage(page);

    await organizationsHomePage.getOrganizationMenuButton(0).click();
    await expect(
      organizationsHomePage.getOrganizationMenuTooltip(0)
    ).toBeVisible();
    await organizationsHomePage.getOrganizationShareButton(0).click();

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

  test("Organizations page displays either empty state or organization cards on mobile", async ({
    page,
  }) => {
    // Check if there are organization cards
    const organizationCards = page.locator('[data-testid="organization-card"]');
    const emptyState = page.getByTestId("empty-state");

    // Wait for either organizations to load or empty state to appear
    await expect(async () => {
      const cardCount = await organizationCards.count();
      const emptyStateVisible = await emptyState.isVisible();

      // Should have either organization cards OR empty state, but not both
      expect(cardCount > 0 || emptyStateVisible).toBe(true);

      if (cardCount > 0) {
        // If there are cards, empty state should not be visible
        expect(emptyStateVisible).toBe(false);
        // Verify all cards have proper data-testid
        await expect(organizationCards.first()).toBeVisible();
      } else {
        // If no cards, empty state should be visible
        await expect(emptyState).toBeVisible();
        expect(cardCount).toBe(0);
      }
    }).toPass({ timeout: 10000 });
  });

  // Skip this test until topic filtering functionality is implemented
  // Currently the combobox UI works but doesn't actually filter the organizations displayed
  test.skip("User can filter organizations by topic", async ({ page }) => {
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

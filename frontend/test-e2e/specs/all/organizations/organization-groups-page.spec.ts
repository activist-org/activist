// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation
  await navigateToOrganizationSubpage(page, "groups");
});

test.describe(
  "Organization Groups Page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    // Note: Check to make sure that this is eventually done for light and dark modes.
    test("Organization Groups Page has no detectable accessibility issues", async ({
      page,
    }, testInfo) => {
      const violations = await runAccessibilityTest(
        "Organization Groups Page",
        page,
        testInfo
      );
      expect
        .soft(violations, "Accessibility violations found:")
        .toHaveLength(0);

      if (violations.length > 0) {
        // Note: For future implementation.
      }
    });

    test("User can view organization groups", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const groupsPage = organizationPage.groupsPage;

      // Wait for groups to load completely
      await page.waitForLoadState("networkidle");

      // Wait for either groups or empty state to appear
      await expect(async () => {
        const groupsListVisible = await groupsPage.groupsList
          .isVisible()
          .catch(() => false);
        const emptyStateVisible = await groupsPage.emptyState
          .isVisible()
          .catch(() => false);
        expect(groupsListVisible || emptyStateVisible).toBe(true);
      }).toPass({ timeout: 10000 });

      // Check if groups exist or empty state is shown
      const groupCount = await groupsPage.getGroupCount();

      if (groupCount > 0) {
        // Verify groups list is visible
        await expect(groupsPage.groupsList).toBeVisible();
        await expect(groupsPage.groupCards.first()).toBeVisible();

        // Verify first group has required elements
        const firstGroupCard = groupsPage.getGroupCard(0);
        await expect(firstGroupCard).toBeVisible();

        const firstGroupTitle = groupsPage.getGroupTitle(0);
        await expect(firstGroupTitle).toBeVisible();

        const firstGroupLink = groupsPage.getGroupLink(0);
        await expect(firstGroupLink).toBeVisible();
        await expect(firstGroupLink).toHaveAttribute("href", /.+/);

        // Verify group description is visible
        const firstGroupDescription = groupsPage.getGroupDescription(0);
        await expect(firstGroupDescription).toBeVisible();
      } else {
        // Verify empty state is shown when no groups
        await expect(groupsPage.emptyState).toBeVisible();
        await expect(groupsPage.emptyStateMessage).toBeVisible();
      }
    });

    test("User can navigate to individual groups", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const groupsPage = organizationPage.groupsPage;

      // Wait for groups to load completely
      await page.waitForLoadState("networkidle");

      const groupCount = await groupsPage.getGroupCount();

      if (groupCount > 0) {
        // Get the first group link URL before clicking
        const firstGroupLink = groupsPage.getGroupLink(0);
        const groupUrl = await firstGroupLink.getAttribute("href");

        expect(groupUrl).toBeTruthy();
        expect(groupUrl).toMatch(/\/organizations\/.+\/groups\/.+/);

        // Click the group to navigate to it
        await groupsPage.navigateToGroup(0);

        // Verify we navigated to the group page
        await expect(page).toHaveURL(new RegExp(groupUrl!));
      } else {
        // Skip test if no groups are available
        test.skip(groupCount > 0, "No groups available to test navigation");
      }
    });

    test("User can share organization groups", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const groupsPage = organizationPage.groupsPage;

      const groupCount = await groupsPage.getGroupCount();

      if (groupCount > 0) {
        // Open the tooltip menu for the first group
        const menuButton = groupsPage.getGroupMenuButton(0);
        await expect(menuButton).toBeVisible();
        await menuButton.click();

        // Verify tooltip menu appears
        const menuTooltip = groupsPage.getGroupMenuTooltip(0);
        await expect(menuTooltip).toBeVisible();

        // Verify share button exists and is clickable
        const shareButton = groupsPage.getGroupShareButton(0);
        await expect(shareButton).toBeVisible();
        await expect(shareButton).toBeEnabled();

        // Click share button to open share modal
        await shareButton.click();

        // Verify share modal opens
        await expect(organizationPage.shareModal.modal).toBeVisible();

        // Close the modal
        const closeButton = organizationPage.shareModal.closeButton(
          organizationPage.shareModal.modal
        );
        await expect(closeButton).toBeVisible();
        await closeButton.click();

        // Verify modal closes
        await expect(organizationPage.shareModal.modal).not.toBeVisible();
      } else {
        // Skip test if no groups are available
        test.skip(groupCount > 0, "No groups available to test sharing");
      }
    });
  }
);

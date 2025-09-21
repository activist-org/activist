// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { testResourceDragAndDrop } from "~/test-e2e/actions/dragAndDrop";
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation
  await navigateToOrganizationSubpage(page, "resources");
});

test.describe(
  "Organization Resources Page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    // Note: Check to make sure that this is eventually done for light and dark modes.
    test.skip("Organization Resources Page has no detectable accessibility issues", async ({
      page,
    }, testInfo) => {
      const violations = await runAccessibilityTest(
        "Organization Resources Page",
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

    test("User can view organization resources", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const resourcesPage = organizationPage.resourcesPage;

      // Wait for resources to load completely
      await page.waitForLoadState("networkidle");

      // Wait for either resources or empty state to appear
      await expect(async () => {
        const resourcesListVisible = await resourcesPage.resourcesList
          .isVisible()
          .catch(() => false);
        const emptyStateVisible = await resourcesPage.emptyState
          .isVisible()
          .catch(() => false);
        expect(resourcesListVisible || emptyStateVisible).toBe(true);
      }).toPass({ timeout: 10000 });

      // Check if resources exist or empty state is shown
      const resourceCount = await resourcesPage.getResourceCount();

      if (resourceCount > 0) {
        // Verify resources list is visible
        await expect(resourcesPage.resourcesList).toBeVisible();
        await expect(resourcesPage.resourceCards.first()).toBeVisible();

        // Verify first resource has required elements
        const firstResourceCard = resourcesPage.getResourceCard(0);
        await expect(firstResourceCard).toBeVisible();

        const firstResourceLink = resourcesPage.getResourceLink(0);
        await expect(firstResourceLink).toBeVisible();
        await expect(firstResourceLink).toHaveAttribute("href", /.+/);

        // Verify resource icon is visible
        const firstResourceIcon = resourcesPage.getResourceIcon(0);
        await expect(firstResourceIcon).toBeVisible();
      } else {
        // Verify empty state is shown when no resources
        await expect(resourcesPage.emptyState).toBeVisible();
        await expect(resourcesPage.emptyStateMessage).toBeVisible();
      }
    });

    test("User can access new resource creation", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const resourcesPage = organizationPage.resourcesPage;

      // Verify new resource button is visible and functional
      await expect(resourcesPage.newResourceButton).toBeVisible();
      await expect(resourcesPage.newResourceButton).toBeEnabled();

      // Click the new resource button to open modal
      await resourcesPage.newResourceButton.click();

      // Verify resource creation modal opens
      await expect(resourcesPage.resourceModal).toBeVisible();

      // Close the modal using the close button
      const closeButton = resourcesPage.resourceModalCloseButton(
        resourcesPage.resourceModal
      );
      await expect(closeButton).toBeVisible();
      await closeButton.click();

      // Verify modal closes
      await expect(resourcesPage.resourceModal).not.toBeVisible();

      // Note: We could add more specific modal testing here
      // but that might be better suited for a dedicated modal test
    });

    test("User can share organization resources", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const resourcesPage = organizationPage.resourcesPage;

      const resourceCount = await resourcesPage.getResourceCount();

      if (resourceCount > 0) {
        // Open the tooltip menu for the first resource
        const menuButton = resourcesPage.getResourceMenuButton(0);
        await expect(menuButton).toBeVisible();
        await menuButton.click();

        // Verify tooltip menu appears
        const menuTooltip = resourcesPage.getResourceMenuTooltip(0);
        await expect(menuTooltip).toBeVisible();

        // Verify share button exists and is clickable
        const shareButton = resourcesPage.getResourceShareButton(0);
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
        // Skip test if no resources are available
        test.skip(resourceCount > 0, "No resources available to test sharing");
      }
    });

    test("User can reorder resources using drag and drop", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const resourcesPage = organizationPage.resourcesPage;

      const resourceCount = await resourcesPage.getResourceCount();

      if (resourceCount >= 2) {
        // Verify drag handles are visible
        const firstResourceDragHandle = resourcesPage.getResourceDragHandle(0);
        const secondResourceDragHandle = resourcesPage.getResourceDragHandle(1);

        await expect(firstResourceDragHandle).toBeVisible();
        await expect(secondResourceDragHandle).toBeVisible();

        // Test drag and drop functionality
        const result = await testResourceDragAndDrop(page, 0, 1);

        // Verify that the order actually changed
        expect(result.orderChanged).toBe(true);
        expect(result.initialOrder).not.toEqual(result.finalOrder);

        // Verify we have the expected number of resources after reordering
        expect(result.initialOrder.length).toBe(resourceCount);
        expect(result.finalOrder.length).toBe(resourceCount);

        // Verify the first resource moved to second position
        expect(result.finalOrder[1]).toBe(result.initialOrder[0]);
      } else {
        // Skip test if insufficient resources for drag and drop testing
        test.skip(
          resourceCount >= 2,
          "Need at least 2 resources to test drag and drop functionality"
        );
      }
    });
  }
);

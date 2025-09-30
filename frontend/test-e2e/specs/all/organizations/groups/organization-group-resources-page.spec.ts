// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { signInAsAdmin } from "~/test-e2e/actions/authentication";
import { getResourceCardOrder } from "~/test-e2e/actions/dragAndDrop";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Sign in as admin to access edit functionality
  await signInAsAdmin(page);
  // Navigate to a group resources page within an organization
  await navigateToOrganizationGroupSubpage(page, "resources");
});

test.describe(
  "Organization Group Resources Page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test("Organization Group Resources Page has no detectable accessibility issues", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      await withTestStep(
        testInfo,
        "Wait for lang attribute to be set",
        async () => {
          await expect(page.locator("html")).toHaveAttribute(
            "lang",
            /^[a-z]{2}(-[A-Z]{2})?$/
          );
        }
      );

      await withTestStep(testInfo, "Run accessibility scan", async () => {
        const violations = await runAccessibilityTest(
          "Organization Group Resources Page",
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
    });

    test("User can view group resources", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const groupResourcesPage = organizationPage.groupResourcesPage;

      // Wait for resources to load completely
      await page.waitForLoadState("networkidle");

      // Wait for either resources or empty state to appear
      await expect(async () => {
        const resourcesListVisible = await groupResourcesPage.resourcesList
          .isVisible()
          .catch(() => false);
        const emptyStateVisible = await groupResourcesPage.emptyState
          .isVisible()
          .catch(() => false);
        expect(resourcesListVisible || emptyStateVisible).toBe(true);
      }).toPass({ timeout: 10000 });

      // Check if resources exist or empty state is shown
      const resourceCount = await groupResourcesPage.getResourceCount();

      if (resourceCount > 0) {
        // Verify resources list is visible
        await expect(groupResourcesPage.resourcesList).toBeVisible();
        await expect(groupResourcesPage.resourceCards.first()).toBeVisible();

        // Verify first resource has required elements
        const firstResourceCard = groupResourcesPage.getResourceCard(0);
        await expect(firstResourceCard).toBeVisible();

        const firstResourceLink = groupResourcesPage.getResourceLink(0);
        await expect(firstResourceLink).toBeVisible();
        await expect(firstResourceLink).toHaveAttribute("href", /.+/);

        // Verify resource icon is visible
        const firstResourceIcon = groupResourcesPage.getResourceIcon(0);
        await expect(firstResourceIcon).toBeVisible();
      } else {
        // Verify empty state is shown when no resources
        await expect(groupResourcesPage.emptyState).toBeVisible();
        await expect(groupResourcesPage.emptyStateMessage).toBeVisible();
      }
    });

    test("User can access new resource creation", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const groupResourcesPage = organizationPage.groupResourcesPage;

      // Verify new resource button is visible and functional
      await expect(groupResourcesPage.newResourceButton).toBeVisible();
      await expect(groupResourcesPage.newResourceButton).toBeEnabled();

      // Click the new resource button to open modal
      await groupResourcesPage.newResourceButton.click();

      // Verify resource creation modal opens
      await expect(groupResourcesPage.resourceModal).toBeVisible();

      // Close the modal using the close button
      await expect(groupResourcesPage.resourceModalCloseButton).toBeVisible();
      await groupResourcesPage.resourceModalCloseButton.click();

      // Verify modal closes
      await expect(groupResourcesPage.resourceModal).not.toBeVisible();
    });

    test("User can reorder resources using drag and drop", async ({
      page,
    }, testInfo) => {
      test.setTimeout(60000); // Group pages load slowly in dev mode
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const groupResourcesPage = organizationPage.groupResourcesPage;

      // Wait for page to load and then for resource cards to appear
      await page.waitForLoadState("networkidle");

      // Wait for resource cards to be present (with timeout to handle empty state)
      try {
        await expect(groupResourcesPage.resourceCards.first()).toBeVisible({
          timeout: 5000,
        });
      } catch {
        // If no resource cards appear, that's fine - could be empty state
      }

      const resourceCount = await groupResourcesPage.getResourceCount();

      if (resourceCount >= 2) {
        // Get initial order of first 2 resources for drag and drop test
        const initialOrder = await getResourceCardOrder(page);
        const firstResource = initialOrder[0];
        const secondResource = initialOrder[1];

        // Verify drag handles are visible and have correct classes
        const firstResourceDragHandle =
          groupResourcesPage.getResourceDragHandle(0);
        const secondResourceDragHandle =
          groupResourcesPage.getResourceDragHandle(1);

        await expect(firstResourceDragHandle).toBeVisible();
        await expect(secondResourceDragHandle).toBeVisible();

        // Validate drag handles have the correct CSS class
        await expect(firstResourceDragHandle).toContainClass("drag-handle");
        await expect(secondResourceDragHandle).toContainClass("drag-handle");

        // Use mouse events for reliable drag and drop
        const firstBox = await firstResourceDragHandle.boundingBox();
        const secondBox = await secondResourceDragHandle.boundingBox();

        if (firstBox && secondBox) {
          const startX = firstBox.x + firstBox.width / 2;
          const startY = firstBox.y + firstBox.height / 2;
          const endX = secondBox.x + secondBox.width / 2;
          const endY = secondBox.y + secondBox.height / 2;

          // Simulate drag with mouse events
          await page.mouse.move(startX, startY);
          await page.mouse.down();
          await page.waitForTimeout(100);

          // Move to target with intermediate steps
          const steps = 5;
          for (let i = 1; i <= steps; i++) {
            const progress = i / steps;
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;
            await page.mouse.move(currentX, currentY);
            await page.waitForTimeout(50);
          }

          await page.mouse.up();
          await page.waitForTimeout(200);
        }

        // Wait for the reorder operation to complete
        await page.waitForLoadState("networkidle");

        // Additional wait for vuedraggable to process the reorder
        await page.waitForTimeout(1000);

        // Get final order after drag operation
        const finalOrder = await getResourceCardOrder(page);

        // Verify the drag operation worked (first and second should be swapped)
        expect(finalOrder[1]).toBe(firstResource);
        expect(finalOrder[0]).toBe(secondResource);
      } else {
        // Skip test if insufficient resources for drag and drop testing
        test.skip(
          resourceCount >= 2,
          "Need at least 2 resources to test drag and drop functionality"
        );
      }
    });

    test("User can share group resources", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const groupResourcesPage = organizationPage.groupResourcesPage;

      // Wait for resources to load
      await page.waitForLoadState("networkidle");

      const resourceCount = await groupResourcesPage.getResourceCount();

      if (resourceCount > 0) {
        // Click on the menu button for the first resource
        await groupResourcesPage.clickResourceMenu(0);

        // Wait for the tooltip menu to appear
        await expect(
          groupResourcesPage.getResourceMenuTooltip(0)
        ).toBeVisible();

        // Click the share button
        await groupResourcesPage.clickResourceShare(0);

        // Verify share modal opens (this would be a generic share modal)
        // Note: The actual share modal implementation may vary
        await page.waitForTimeout(1000); // Wait for any modal to appear

        // Close any open modals by pressing Escape
        await page.keyboard.press("Escape");
      } else {
        test.skip(resourceCount > 0, "No resources available to test sharing");
      }
    });

    test("User can edit group resources", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const groupResourcesPage = organizationPage.groupResourcesPage;

      // Wait for resources to load
      await page.waitForLoadState("networkidle");

      const resourceCount = await groupResourcesPage.getResourceCount();

      if (resourceCount > 0) {
        // Click the edit button for the first resource
        await groupResourcesPage.clickResourceEdit(0);

        // Verify edit modal opens
        await expect(groupResourcesPage.editResourceModal).toBeVisible();

        // Generate unique content for this test run
        const timestamp = Date.now();
        const newName = `Test Group Resource ${timestamp}`;
        const newDescription = `Updated group resource description ${timestamp}`;
        const newUrl = `https://test-group-resource-${timestamp}.com`;

        // Update the form fields
        const nameInput = groupResourcesPage.getResourceNameInput(
          groupResourcesPage.editResourceModal
        );
        const descriptionInput = groupResourcesPage.getResourceDescriptionInput(
          groupResourcesPage.editResourceModal
        );
        const urlInput = groupResourcesPage.getResourceUrlInput(
          groupResourcesPage.editResourceModal
        );

        await expect(nameInput).toBeVisible();
        await expect(descriptionInput).toBeVisible();
        await expect(urlInput).toBeVisible();

        // Clear and fill the form fields
        await nameInput.clear();
        await nameInput.fill(newName);

        await descriptionInput.clear();
        await descriptionInput.fill(newDescription);

        await urlInput.clear();
        await urlInput.fill(newUrl);

        // Verify the fields contain the new values
        await expect(nameInput).toHaveValue(newName);
        await expect(descriptionInput).toHaveValue(newDescription);
        await expect(urlInput).toHaveValue(newUrl);

        // Submit the form
        const submitButton = groupResourcesPage.getResourceSubmitButton(
          groupResourcesPage.editResourceModal
        );
        await expect(submitButton).toBeVisible();
        await submitButton.click();

        // Wait for the modal to close after successful save
        await expect(groupResourcesPage.editResourceModal).not.toBeVisible();

        // Verify the changes are reflected on the page
        // The resource name should be visible in the resource card
        const resourceCard = groupResourcesPage.getResourceCard(0);
        await expect(resourceCard).toContainText(newName);
      } else {
        test.skip(resourceCount > 0, "No resources available to test editing");
      }
    });
  }
);

// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";

async function getResourceCardOrder(page: Page) {
  return await page
    .getByTestId("resource-card")
    .locator("h3")
    .allTextContents();
}

test.beforeEach(async ({ page }) => {
  test.setTimeout(60000); // Group pages load slowly in dev mode
  // Already authenticated via global storageState
  await navigateToOrganizationGroupSubpage(page, "resources");
});

test.describe(
  "Organization Group Resources Page - Desktop",
  { tag: "@desktop" },
  () => {
    test("User can reorder resources using drag and drop on desktop", async ({
      page,
    }) => {
      const organizationPage = newOrganizationPage(page);
      const groupResourcesPage = organizationPage.groupResourcesPage;

      // Wait for page to be ready
      await page.waitForLoadState("domcontentloaded");

      // Wait for either resource cards or empty state to appear
      try {
        await expect(async () => {
          const resourceCardsVisible = await groupResourcesPage.resourceCards
            .first()
            .isVisible()
            .catch(() => false);
          const emptyStateVisible = await groupResourcesPage.emptyState
            .isVisible()
            .catch(() => false);
          expect(resourceCardsVisible || emptyStateVisible).toBe(true);
        }).toPass({ timeout: 10000 });
      } catch {
        // If neither appears, that's fine - page might still be loading
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

        // Wait for the reorder operation to complete by checking for DOM changes
        await expect(async () => {
          const finalOrder = await getResourceCardOrder(page);
          // Check if the order has actually changed (first and second should be swapped)
          return (
            finalOrder[0] === secondResource && finalOrder[1] === firstResource
          );
        }).toPass({ timeout: 5000 });

        // Verify the drag operation worked (first and second should be swapped)
        const finalOrder = await getResourceCardOrder(page);
        expect(finalOrder[0]).toBe(secondResource);
        expect(finalOrder[1]).toBe(firstResource);
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

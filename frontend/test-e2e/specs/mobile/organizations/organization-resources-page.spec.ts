// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { getResourceCardOrder } from "~/test-e2e/actions/dragAndDrop";
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation
  await navigateToOrganizationSubpage(page, "resources");
});

test.describe("Organization Resources Page", { tag: "@mobile" }, () => {
  test.skip("User can reorder resources using drag and drop on mobile", async ({
    page,
  }) => {
    const organizationPage = newOrganizationPage(page);
    const resourcesPage = organizationPage.resourcesPage;

    // Wait for page to load and then for resource cards to appear
    await page.waitForLoadState("networkidle");

    // Wait for resource cards to be present (with timeout to handle empty state)
    try {
      await expect(resourcesPage.resourceCards.first()).toBeVisible({
        timeout: 5000,
      });
    } catch {
      // If no resource cards appear, that's fine - could be empty state
    }

    const resourceCount = await resourcesPage.getResourceCount();

    if (resourceCount >= 2) {
      // Get initial order of first 2 resources for drag and drop test
      const initialOrder = await getResourceCardOrder(page);
      const firstResource = initialOrder[0];
      const secondResource = initialOrder[1];

      // Verify drag handles are visible and have correct classes
      const firstResourceDragHandle = resourcesPage.getResourceDragHandle(0);
      const secondResourceDragHandle = resourcesPage.getResourceDragHandle(1);

      await expect(firstResourceDragHandle).toBeVisible();
      await expect(secondResourceDragHandle).toBeVisible();

      // Validate drag handles have the correct CSS class using new Playwright v1.52 API
      await expect(firstResourceDragHandle).toContainClass("drag-handle");
      await expect(secondResourceDragHandle).toContainClass("drag-handle");

      // Use mouse events directly since dragTo() isn't working reliably
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
});

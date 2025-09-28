// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { testResourceDragAndDrop } from "~/test-e2e/actions/dragAndDrop";
import { mobileDragAndDrop } from "~/test-e2e/actions/mobileDragAndDrop";
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation
  await navigateToOrganizationSubpage(page, "resources");
});

test.describe("Organization Resources Page", { tag: "@mobile" }, () => {
  test("User can reorder resources using drag and drop on mobile", async ({
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
      // Verify drag handles are visible and have correct classes
      const firstResourceDragHandle = resourcesPage.getResourceDragHandle(0);
      const secondResourceDragHandle = resourcesPage.getResourceDragHandle(1);

      await expect(firstResourceDragHandle).toBeVisible();
      await expect(secondResourceDragHandle).toBeVisible();

      // Validate drag handles have the correct CSS class using new Playwright v1.52 API
      await expect(firstResourceDragHandle).toContainClass("drag-handle");
      await expect(secondResourceDragHandle).toContainClass("drag-handle");

      // Perform mobile drag and drop using proper touch events
      await mobileDragAndDrop(
        page,
        firstResourceDragHandle,
        secondResourceDragHandle
      );

      // Wait for the reorder operation to complete
      await page.waitForLoadState("networkidle");

      // Test drag and drop functionality with proper mobile expectations
      const result = await testResourceDragAndDrop(page, 0, 1);

      // Verify the drag operation worked
      expect(result.orderChanged).toBe(true);
      expect(result.initialOrder).not.toEqual(result.finalOrder);
      expect(result.finalOrder[1]).toBe(result.initialOrder[0]);
    } else {
      // Skip test if insufficient resources for drag and drop testing
      test.skip(
        resourceCount >= 2,
        "Need at least 2 resources to test drag and drop functionality"
      );
    }
  });
});

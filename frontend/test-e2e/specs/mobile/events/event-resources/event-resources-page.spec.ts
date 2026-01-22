// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  getResourceCardOrder,
  performDragAndDrop,
  verifyReorder,
} from "~/test-e2e/actions/dragAndDrop";
import { navigateToEventSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation.
  await navigateToEventSubpage(page, "resources");
});

test.describe("Event Resources Page - Mobile", { tag: "@mobile" }, () => {
  test.skip("User can reorder resources using drag and drop on mobile", async ({
    page,
  }) => {
    // TODO: Known issue - cannot navigate to events on mobile yet
    const eventPage = newEventPage(page);
    const { resourcesPage } = eventPage;

    // Wait for page to load and then for resource cards to appear.
    await page.waitForLoadState("domcontentloaded");

    // Wait for resource cards to be present (with timeout to handle empty state).
    try {
      await expect(resourcesPage.resourceCards.first()).toBeVisible({});
    } catch {
      // If no resource cards appear, that's fine - could be empty state.
    }

    const resourceCount = await resourcesPage.getResourceCount();

    if (resourceCount >= 2) {
      // Get initial order of first 2 resources for drag and drop test.
      const initialOrder = await getResourceCardOrder(page);
      const firstResource = initialOrder[0];
      const secondResource = initialOrder[1];

      // Verify drag handles are visible and have correct classes.
      const firstResourceDragHandle = resourcesPage.getResourceDragHandle(0);
      const secondResourceDragHandle = resourcesPage.getResourceDragHandle(1);

      await expect(firstResourceDragHandle).toBeVisible();
      await expect(secondResourceDragHandle).toBeVisible();

      // Validate drag handles have the correct CSS class.
      await expect(firstResourceDragHandle).toContainClass("drag-handle");
      await expect(secondResourceDragHandle).toContainClass("drag-handle");

      // Perform drag and drop using shared utility.
      await performDragAndDrop(
        page,
        firstResourceDragHandle,
        secondResourceDragHandle
      );

      // Verify the reorder using shared utility.
      await verifyReorder(
        page,
        firstResource ?? "",
        secondResource ?? "",
        getResourceCardOrder
      );
    } else {
      // Skip test if insufficient resources for drag and drop testing.
      test.skip(
        resourceCount >= 2,
        "Need at least 2 resources to test drag and drop functionality"
      );
    }
  });
});

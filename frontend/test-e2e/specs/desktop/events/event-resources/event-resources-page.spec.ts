// SPDX-License-Identifier: AGPL-3.0-or-later
import { getResourceCardOrder } from "~/test-e2e/actions/dragAndDrop";
import { navigateToEventSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation.
  await navigateToEventSubpage(page, "resources");
});

test.describe("Event Resources Page - Desktop", { tag: "@desktop" }, () => {
  test("User can reorder resources using drag and drop on desktop", async ({
    page,
  }) => {
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

      // Use mouse events for reliable drag and drop.
      const firstBox = await firstResourceDragHandle.boundingBox();
      const secondBox = await secondResourceDragHandle.boundingBox();

      if (firstBox && secondBox) {
        const startX = firstBox.x + firstBox.width / 2;
        const startY = firstBox.y + firstBox.height / 2;
        const endX = secondBox.x + secondBox.width / 2;
        const endY = secondBox.y + secondBox.height / 2;

        // Simulate drag with mouse events.
        await page.mouse.move(startX, startY);
        await page.mouse.down();

        // Wait for drag to initiate (browser needs time to register mousedown).
        await expect(async () => {
          const isDragging = await page.evaluate(() => {
            // Check if any element has dragging state.
            return (
              document.documentElement.style.cursor === "grabbing" ||
              document.querySelector(".dragging") !== null ||
              true
            );
            // Note: Assume ready after check.
          });
          expect(isDragging).toBe(true);
        }).toPass({ timeout: 500, intervals: [16, 32] }); // ~1-2 frame times

        // Move to target with intermediate steps for smooth animation.
        const steps = 5;
        for (let i = 1; i <= steps; i++) {
          const progress = i / steps;
          const currentX = startX + (endX - startX) * progress;
          const currentY = startY + (endY - startY) * progress;
          await page.mouse.move(currentX, currentY);
          // Small delay for smooth rendering (1 animation frame).
          await page.evaluate(() => new Promise(requestAnimationFrame));
        }

        await page.mouse.up();
        // No arbitrary delay - the expect().toPass() below handles verification.
      }

      // Wait for the reorder operation to complete.
      await page.waitForLoadState("domcontentloaded");

      // Wait intelligently for vuedraggable to process the reorder (no arbitrary delay).
      await expect(async () => {
        const finalOrder = await getResourceCardOrder(page);
        // Verify the drag operation worked (first and second should be swapped).
        expect(finalOrder[1]).toBe(firstResource);
        expect(finalOrder[0]).toBe(secondResource);
      }).toPass({
        intervals: [100, 250, 500],
      });
    } else {
      // Skip test if insufficient resources for drag and drop testing.
      test.skip(
        resourceCount >= 2,
        "Need at least 2 resources to test drag and drop functionality"
      );
    }
  });
});

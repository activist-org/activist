// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

/**
 * Resource Drag and Drop Feature
 * Handles resource card reordering via drag and drop
 */
export const ResourceDragDrop = (page: Page) => {
  return {
    // MARK: Drag Handles

    getResourceDragHandle(index: number) {
      return page
        .getByTestId("resource-card")
        .nth(index)
        .getByTestId("resource-drag-handle");
    },

    // MARK: Drag Operations

    async dragResourceToPosition(fromIndex: number, toIndex: number) {
      const sourceHandle = this.getResourceDragHandle(fromIndex);
      const targetHandle = this.getResourceDragHandle(toIndex);

      const sourceBox = await sourceHandle.boundingBox();
      const targetBox = await targetHandle.boundingBox();

      if (sourceBox && targetBox) {
        const startX = sourceBox.x + sourceBox.width / 2;
        const startY = sourceBox.y + sourceBox.height / 2;
        const endX = targetBox.x + targetBox.width / 2;
        const endY = targetBox.y + targetBox.height / 2;

        // Simulate drag with mouse events.
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        // Wait for drag to initiate (1-2 animation frames).
        await page.evaluate(
          () =>
            new Promise((resolve) => {
              requestAnimationFrame(() => requestAnimationFrame(resolve));
            })
        );

        // Move to target with intermediate steps.
        const steps = 5;
        for (let i = 1; i <= steps; i++) {
          const progress = i / steps;
          const currentX = startX + (endX - startX) * progress;
          const currentY = startY + (endY - startY) * progress;
          await page.mouse.move(currentX, currentY);
          // Smooth rendering (1 animation frame per step).
          await page.evaluate(() => new Promise(requestAnimationFrame));
        }

        await page.mouse.up();
        // No delay - let caller verify result with expect().toPass().
      }
    },
  };
};
export type ResourceDragDropType = ReturnType<typeof ResourceDragDrop>;

// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

/**
 * FAQ Drag and Drop Feature
 * Handles FAQ card reordering via drag and drop
 */
export const FAQDragDrop = (page: Page) => {
  return {
    // MARK: Drag Handles
    getFaqDragHandle(index: number) {
      return page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-drag-handle");
    },

    async getFaqDragHandlePosition(index: number) {
      const dragHandle = this.getFaqDragHandle(index);
      return await dragHandle.boundingBox();
    },

    // MARK: Drag Operations
    async dragFaqToPosition(fromIndex: number, toIndex: number) {
      const sourceHandle = this.getFaqDragHandle(fromIndex);
      const targetHandle = this.getFaqDragHandle(toIndex);

      const sourceBox = await sourceHandle.boundingBox();
      const targetBox = await targetHandle.boundingBox();

      if (sourceBox && targetBox) {
        const startX = sourceBox.x + sourceBox.width / 2;
        const startY = sourceBox.y + sourceBox.height / 2;
        const endX = targetBox.x + targetBox.width / 2;
        const endY = targetBox.y + targetBox.height / 2;

        // Hover over the source handle first.
        await page.mouse.move(startX, startY);
        // Wait for hover state to register (1 animation frame).
        await page.evaluate(() => new Promise(requestAnimationFrame));

        // Start drag operation.
        await page.mouse.down();
        // Wait for drag to initiate (1-2 animation frames).
        await page.evaluate(
          () =>
            new Promise((resolve) => {
              requestAnimationFrame(() => requestAnimationFrame(resolve));
            })
        );

        // Move to target with more intermediate steps for smoother drag.
        const steps = 10;
        for (let i = 1; i <= steps; i++) {
          const progress = i / steps;
          const currentX = startX + (endX - startX) * progress;
          const currentY = startY + (endY - startY) * progress;
          await page.mouse.move(currentX, currentY);
          // Smooth rendering (1 animation frame per step).
          await page.evaluate(() => new Promise(requestAnimationFrame));
        }

        // Hover over target for a moment before releasing.
        await page.mouse.move(endX, endY);
        await page.evaluate(() => new Promise(requestAnimationFrame));

        // Release the mouse.
        await page.mouse.up();
        // No delay - let caller verify result with expect().toPass().
      }
    },
  };
};
export type FAQDragDropType = ReturnType<typeof FAQDragDrop>;

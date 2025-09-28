// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

/**
 * Mobile-specific drag and drop utilities for vuedraggable components
 * vuedraggable uses SortableJS which requires specific touch event sequences
 */

/**
 * Performs mobile drag and drop for vuedraggable components
 * Uses the proper touch event sequence that SortableJS expects
 */
export async function mobileDragAndDrop(
  page: Page,
  sourceHandle: Locator,
  targetHandle: Locator
): Promise<void> {
  // Get bounding boxes for precise positioning
  const sourceBox = await sourceHandle.boundingBox();
  const targetBox = await targetHandle.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error("Could not get bounding boxes for drag handles");
  }

  // Calculate center points
  const sourceX = sourceBox.x + sourceBox.width / 2;
  const sourceY = sourceBox.y + sourceBox.height / 2;
  const targetX = targetBox.x + targetBox.width / 2;
  const targetY = targetBox.y + targetBox.height / 2;

  // Step 1: Focus and activate the source element
  await sourceHandle.focus();
  await sourceHandle.hover();

  // Step 2: Touch start - this initializes the drag
  await sourceHandle.dispatchEvent("touchstart", {
    touches: [{ identifier: 0, clientX: sourceX, clientY: sourceY }],
    changedTouches: [{ identifier: 0, clientX: sourceX, clientY: sourceY }],
    targetTouches: [{ identifier: 0, clientX: sourceX, clientY: sourceY }],
  });

  // Small delay to ensure touchstart is processed
  await page.waitForTimeout(100);

  // Step 3: Trigger mousedown for SortableJS compatibility
  await sourceHandle.dispatchEvent("mousedown", {
    button: 0,
    clientX: sourceX,
    clientY: sourceY,
  });

  // Step 4: Simulate drag movement with multiple touchmove events
  const steps = 10; // More steps for smoother movement
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const currentX = sourceX + (targetX - sourceX) * progress;
    const currentY = sourceY + (targetY - sourceY) * progress;

    // Touch move
    await sourceHandle.dispatchEvent("touchmove", {
      touches: [{ identifier: 0, clientX: currentX, clientY: currentY }],
      changedTouches: [{ identifier: 0, clientX: currentX, clientY: currentY }],
      targetTouches: [{ identifier: 0, clientX: currentX, clientY: currentY }],
    });

    // Mouse move for SortableJS
    await sourceHandle.dispatchEvent("mousemove", {
      clientX: currentX,
      clientY: currentY,
    });

    // Small delay between steps
    await page.waitForTimeout(50);
  }

  // Step 5: Hover over target to trigger dragenter/dragover
  await targetHandle.hover();

  // Step 6: Touch end - this completes the drag
  await sourceHandle.dispatchEvent("touchend", {
    changedTouches: [{ identifier: 0, clientX: targetX, clientY: targetY }],
  });

  // Step 7: Mouse up for SortableJS
  await sourceHandle.dispatchEvent("mouseup", {
    button: 0,
    clientX: targetX,
    clientY: targetY,
  });

  // Wait for the drag operation to complete
  await page.waitForTimeout(300);
}

/**
 * Alternative method using Playwright's touch API
 * This is more reliable for some mobile scenarios
 */
export async function mobileDragAndDropTouch(
  page: Page,
  sourceHandle: Locator,
  targetHandle: Locator
): Promise<void> {
  // Get bounding boxes
  const sourceBox = await sourceHandle.boundingBox();
  const targetBox = await targetHandle.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error("Could not get bounding boxes for drag handles");
  }

  // Calculate center points
  const sourceX = sourceBox.x + sourceBox.width / 2;
  const sourceY = sourceBox.y + sourceBox.height / 2;
  const targetX = targetBox.x + targetBox.width / 2;
  const targetY = targetBox.y + targetBox.height / 2;

  // Use Playwright's touch API with proper sequence
  await page.touchscreen.tap(sourceX, sourceY);
  await page.waitForTimeout(200);

  // Simulate drag with multiple touch points using mouse events
  const steps = 8;
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const currentX = sourceX + (targetX - sourceX) * progress;
    const currentY = sourceY + (targetY - sourceY) * progress;

    // Move mouse to simulate touch movement
    await page.mouse.move(currentX, currentY);
    await page.waitForTimeout(80);
  }

  // Release touch by releasing mouse
  await page.mouse.up();
  await page.waitForTimeout(300);
}

/**
 * Method using Playwright's dragAndDrop with mobile-optimized settings
 */
export async function mobileDragAndDropPlaywright(
  page: Page,
  sourceHandle: Locator,
  targetHandle: Locator
): Promise<void> {
  // Use Locator.dragTo() method instead of page.dragAndDrop()
  await sourceHandle.dragTo(targetHandle, {
    // Force the action
    force: true,
  });

  // Wait for the operation to complete
  await page.waitForTimeout(500);
}

/**
 * Hybrid approach - combines multiple methods for maximum reliability
 */
export async function mobileDragAndDropHybrid(
  page: Page,
  sourceHandle: Locator,
  targetHandle: Locator
): Promise<void> {
  try {
    // Try the touch event method first
    await mobileDragAndDrop(page, sourceHandle, targetHandle);
  } catch {
    try {
      // Fallback to touch API
      await mobileDragAndDropTouch(page, sourceHandle, targetHandle);
    } catch {
      try {
        // Try Playwright's dragAndDrop with mobile settings
        await mobileDragAndDropPlaywright(page, sourceHandle, targetHandle);
      } catch {
        throw new Error("All mobile drag and drop methods failed");
      }
    }
  }
}

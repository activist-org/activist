// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

/**
 * Drag and drop utility functions for testing reorderable lists
 */

/**
 * Drags a resource card from one position to another position
 * @param page - Playwright page object
 * @param fromIndex - Index of the source resource card (0-based)
 * @param toIndex - Index of the target resource card (0-based)
 */
export async function dragResourceCard(
  page: Page,
  fromIndex: number,
  toIndex: number
): Promise<void> {
  // Wait for the resources list to be fully loaded
  await page.waitForSelector('[data-testid="organization-resources-list"]');

  // Get the drag handles for source and target cards
  const sourceHandle = page
    .getByTestId("resource-card")
    .nth(fromIndex)
    .getByTestId("resource-drag-handle");

  const targetHandle = page
    .getByTestId("resource-card")
    .nth(toIndex)
    .getByTestId("resource-drag-handle");

  // Ensure both handles are visible and ready
  await sourceHandle.waitFor({ state: "visible" });
  await targetHandle.waitFor({ state: "visible" });

  // Perform the drag and drop operation
  await sourceHandle.dragTo(targetHandle);

  // Wait a moment for the drag operation to complete and any animations to finish
  await page.waitForTimeout(500);
}

/**
 * Gets the current order of resource cards by extracting their names/titles
 * This can be used to verify that drag and drop reordering worked correctly
 * @param page - Playwright page object
 * @returns Array of resource names in their current order
 */
export async function getResourceCardOrder(page: Page): Promise<string[]> {
  // Wait for resources to be loaded
  await page.waitForSelector('[data-testid="resource-card"]');

  // Get all resource cards
  const resourceCards = page.getByTestId("resource-card");
  const count = await resourceCards.count();

  const resourceNames: string[] = [];

  // Extract the name/title from each resource card
  for (let i = 0; i < count; i++) {
    const card = resourceCards.nth(i);
    // The resource name is in an h3 element within the card
    const nameElement = card.locator("h3").first();
    const name = await nameElement.textContent();
    if (name) {
      resourceNames.push(name.trim());
    }
  }

  return resourceNames;
}

/**
 * Verifies that drag and drop functionality is working by:
 * 1. Recording initial order
 * 2. Performing a drag operation
 * 3. Verifying the order has changed
 * @param page - Playwright page object
 * @param fromIndex - Index of the source resource card
 * @param toIndex - Index of the target resource card
 * @returns Object with initial and final order for verification
 */
export async function testResourceDragAndDrop(
  page: Page,
  fromIndex: number,
  toIndex: number
): Promise<{
  initialOrder: string[];
  finalOrder: string[];
  orderChanged: boolean;
}> {
  // Get initial order
  const initialOrder = await getResourceCardOrder(page);

  // Perform drag and drop
  await dragResourceCard(page, fromIndex, toIndex);

  // Get final order
  const finalOrder = await getResourceCardOrder(page);

  // Check if order actually changed
  const orderChanged =
    JSON.stringify(initialOrder) !== JSON.stringify(finalOrder);

  return {
    initialOrder,
    finalOrder,
    orderChanged,
  };
}

/**
 * Alternative drag and drop method using mouse actions for more control
 * Useful if the simple dragTo method doesn't work reliably
 * @param page - Playwright page object
 * @param fromIndex - Index of the source resource card
 * @param toIndex - Index of the target resource card
 */
export async function dragResourceCardWithMouse(
  page: Page,
  fromIndex: number,
  toIndex: number
): Promise<void> {
  // Get the drag handles
  const sourceHandle = page
    .getByTestId("resource-card")
    .nth(fromIndex)
    .getByTestId("resource-drag-handle");

  const targetHandle = page
    .getByTestId("resource-card")
    .nth(toIndex)
    .getByTestId("resource-drag-handle");

  // Get bounding boxes for precise positioning
  const sourceBoundingBox = await sourceHandle.boundingBox();
  const targetBoundingBox = await targetHandle.boundingBox();

  if (!sourceBoundingBox || !targetBoundingBox) {
    throw new Error("Could not get bounding boxes for drag handles");
  }

  // Calculate center points
  const sourceX = sourceBoundingBox.x + sourceBoundingBox.width / 2;
  const sourceY = sourceBoundingBox.y + sourceBoundingBox.height / 2;
  const targetX = targetBoundingBox.x + targetBoundingBox.width / 2;
  const targetY = targetBoundingBox.y + targetBoundingBox.height / 2;

  // Perform drag with mouse actions
  await page.mouse.move(sourceX, sourceY);
  await page.mouse.down();
  await page.waitForTimeout(100); // Brief pause to ensure drag starts
  await page.mouse.move(targetX, targetY, { steps: 10 });
  await page.waitForTimeout(100); // Brief pause before drop
  await page.mouse.up();

  // Wait for drag operation to complete
  await page.waitForTimeout(500);
}

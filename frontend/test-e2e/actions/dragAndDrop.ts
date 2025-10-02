// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

/**
 * Drag and drop utility functions for testing reorderable lists
 */

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
    const nameElement = card.getByRole("heading", { level: 3 }).first();
    const name = await nameElement.textContent();
    if (name) {
      resourceNames.push(name.trim());
    }
  }

  return resourceNames;
}

/**
 * Gets the current order of FAQ cards by extracting their questions
 * This can be used to verify that drag and drop reordering worked correctly
 * @param page - Playwright page object
 * @returns Array of FAQ questions in their current order
 */
export async function getFAQCardOrder(page: Page): Promise<string[]> {
  // Wait for FAQ cards to be loaded
  await page.waitForSelector('[data-testid="faq-card"]');

  // Get all FAQ cards
  const faqCards = page.getByTestId("faq-card");
  const count = await faqCards.count();

  const faqQuestions: string[] = [];

  // Extract the question from each FAQ card
  for (let i = 0; i < count; i++) {
    const card = faqCards.nth(i);
    // The FAQ question is in a p element with data-testid="faq-question"
    const questionElement = card.getByTestId("faq-question");
    const question = await questionElement.textContent();
    if (question) {
      faqQuestions.push(question.trim());
    }
  }
  return faqQuestions;
}

/**
 * Performs a drag and drop operation from source to target using mouse events
 * This uses intermediate steps for smooth dragging to ensure vuedraggable detects the operation
 * @param page - Playwright page object
 * @param sourceLocator - The locator for the element to drag (typically a drag handle)
 * @param targetLocator - The locator for the target position (typically another drag handle)
 * @param steps - Number of intermediate steps for the drag motion (default: 5)
 */
export async function performDragAndDrop(
  page: Page,
  sourceLocator: Locator,
  targetLocator: Locator,
  steps = 5
): Promise<void> {
  // Get bounding boxes for source and target
  const sourceBox = await sourceLocator.boundingBox();
  const targetBox = await targetLocator.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error("Could not get bounding boxes for drag and drop elements");
  }

  // Calculate center points
  const startX = sourceBox.x + sourceBox.width / 2;
  const startY = sourceBox.y + sourceBox.height / 2;
  const endX = targetBox.x + targetBox.width / 2;
  const endY = targetBox.y + targetBox.height / 2;

  // Move to start position and press mouse button
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.waitForTimeout(100);

  // Move to target with intermediate steps for smooth drag
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;
    await page.mouse.move(currentX, currentY);
    await page.waitForTimeout(50);
  }

  // Release mouse button
  await page.mouse.up();
  await page.waitForTimeout(200);
}

/**
 * Verifies that two items were successfully reordered (swapped positions)
 * @param page - Playwright page object
 * @param expectedFirstItem - The item that should now be in the first position
 * @param expectedSecondItem - The item that should now be in the second position
 * @param getOrderFunction - Function to get the current order of items
 */
export async function verifyReorder(
  page: Page,
  expectedFirstItem: string,
  expectedSecondItem: string,
  getOrderFunction: (page: Page) => Promise<string[]>
): Promise<void> {
  // Wait for the reorder operation to complete by checking for DOM changes
  await page.waitForLoadState("domcontentloaded");

  // Additional wait for vuedraggable to process the reorder
  await page.waitForTimeout(500);

  // Get final order after drag operation
  const finalOrder = await getOrderFunction(page);

  // Verify the items are in the expected positions (swapped)
  if (
    finalOrder[0] !== expectedSecondItem ||
    finalOrder[1] !== expectedFirstItem
  ) {
    throw new Error(
      `Reorder verification failed. Expected [${expectedSecondItem}, ${expectedFirstItem}], but got [${finalOrder[0]}, ${finalOrder[1]}]`
    );
  }
}

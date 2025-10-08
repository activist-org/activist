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
  // Wait for resources to be loaded.
  await page.waitForSelector('[data-testid="resource-card"]');

  // Get all resource cards.
  const resourceCards = page.getByTestId("resource-card");
  const count = await resourceCards.count();

  const resourceNames: string[] = [];

  // Extract the name/title from each resource card.
  for (let i = 0; i < count; i++) {
    const card = resourceCards.nth(i);
    // The resource name is in an h3 element within the card.
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
  // Wait for FAQ cards to be loaded.
  await page.waitForSelector('[data-testid="faq-card"]');

  const faqCards = page.getByTestId("faq-card");
  const count = await faqCards.count();

  const faqQuestions: string[] = [];

  // Extract the question from each FAQ card.
  for (let i = 0; i < count; i++) {
    const card = faqCards.nth(i);

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
  steps = 10
): Promise<void> {
  // Get bounding boxes for source and target.
  const sourceBox = await sourceLocator.boundingBox();
  const targetBox = await targetLocator.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error("Could not get bounding boxes for drag and drop elements");
  }

  // Calculate center points.
  const startX = sourceBox.x + sourceBox.width / 2;
  const startY = sourceBox.y + sourceBox.height / 2;
  const endX = targetBox.x + targetBox.width / 2;
  const endY = targetBox.y + targetBox.height / 2;

  // Move to start position.
  await page.mouse.move(startX, startY);

  // Press mouse button.
  await page.mouse.down();

  // Wait for drag start to be detected by observing CSS class change.
  await page
    .waitForFunction(
      () => {
        const dragElements = document.querySelectorAll(
          ".sortable-chosen, .sortable-drag"
        );
        return dragElements.length > 0;
      },
      { timeout: 5000 }
    )
    .catch(() => {
      // If no sortable classes appear, continue anyway (might work without them).
    });

  // Move to target with intermediate steps for smooth drag.
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;
    await page.mouse.move(currentX, currentY);
  }

  // Release mouse button.
  await page.mouse.up();

  // Wait for animation to complete by checking if ghost/chosen classes are removed.
  await page
    .waitForFunction(
      () => {
        const dragElements = document.querySelectorAll(
          ".sortable-chosen, .sortable-drag, .sortable-ghost"
        );
        return dragElements.length === 0;
      },
      { timeout: 2000 }
    )
    .catch(() => {
      // If classes don't clear, continue anyway (might have completed).
    });
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
  // Use Playwright's built-in polling mechanism to wait for the order to change.
  // This retries automatically until the condition is met or timeout is reached.
  await page.waitForFunction(
    async ({ expected }) => {
      // This function runs in the browser context repeatedly until it returns true.
      // We need to re-query the DOM each time to get the latest order.

      // MARK: FAQ Card

      const faqCards = document.querySelectorAll('[data-testid="faq-card"]');
      if (faqCards.length >= 2) {
        const firstQuestion = faqCards[0]
          ?.querySelector('[data-testid="faq-question"]')
          ?.textContent?.trim();
        const secondQuestion = faqCards[1]
          ?.querySelector('[data-testid="faq-question"]')
          ?.textContent?.trim();

        if (
          firstQuestion === expected.second &&
          secondQuestion === expected.first
        ) {
          return true;
        }
      }

      // MARK: Resource Card

      const resourceCards = document.querySelectorAll(
        '[data-testid="resource-card"]'
      );
      if (resourceCards.length >= 2) {
        const firstResource = resourceCards[0]
          ?.querySelector("h3")
          ?.textContent?.trim();
        const secondResource = resourceCards[1]
          ?.querySelector("h3")
          ?.textContent?.trim();

        if (
          firstResource === expected.second &&
          secondResource === expected.first
        ) {
          return true;
        }
      }

      return false;
    },
    {
      expected: {
        first: expectedFirstItem,
        second: expectedSecondItem,
      },
    },
    {
      timeout: 10000,
      polling: 100, // poll every 100ms
    }
  );

  // Final verification to provide clear error message if somehow still wrong.
  const finalOrder = await getOrderFunction(page);
  if (
    finalOrder[0] !== expectedSecondItem ||
    finalOrder[1] !== expectedFirstItem
  ) {
    throw new Error(
      `Reorder verification failed. Expected [${expectedSecondItem}, ${expectedFirstItem}], but got [${finalOrder[0]}, ${finalOrder[1]}]`
    );
  }
}

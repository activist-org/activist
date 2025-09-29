// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

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

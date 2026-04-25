// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { expect } from "~/test-e2e/global-fixtures";

/**
 * FAQ Page Object interface that supports both naming conventions.
 */
interface FAQPageObject {
  getFAQCount?: () => Promise<number>;
  getFaqCount?: () => Promise<number>;
  newFAQButton?: Locator;
  newFaqButton?: Locator;
  faqModal: Locator;
  faqQuestionInput?: (modal: Locator) => Locator;
  faqAnswerInput?: (modal: Locator) => Locator;
  faqSubmitButton?: (modal: Locator) => Locator;
  getFaqQuestionInput?: (modal: Locator) => Locator;
  getFaqAnswerInput?: (modal: Locator) => Locator;
  getFaqSubmitButton?: (modal: Locator) => Locator;
}

/**
 * Ensures that at least the specified number of FAQs exist by creating them if needed.
 * Returns the total number of FAQs after ensuring the minimum count.
 *
 * Works with both Event/Organization FAQ page objects and Group FAQ page objects.
 *
 * @param page - Playwright Page object
 * @param faqPage - FAQ page object with methods for interacting with FAQs
 * @param minCount - Minimum number of FAQs required (default: 2)
 * @returns Promise<number> - Total number of FAQs after ensuring minimum
 */
export async function ensureMinimumFAQs(
  page: Page,
  faqPage: FAQPageObject,
  minCount: number = 2
): Promise<number> {
  await page.waitForLoadState("domcontentloaded");

  // Support both naming conventions (FAQ vs Faq)
  const getCount = faqPage.getFAQCount || faqPage.getFaqCount;
  const newButton = faqPage.newFAQButton || faqPage.newFaqButton;
  const getQuestionInput =
    faqPage.faqQuestionInput || faqPage.getFaqQuestionInput;
  const getAnswerInput = faqPage.faqAnswerInput || faqPage.getFaqAnswerInput;
  const getSubmitButton = faqPage.faqSubmitButton || faqPage.getFaqSubmitButton;

  if (
    !getCount ||
    !newButton ||
    !getQuestionInput ||
    !getAnswerInput ||
    !getSubmitButton
  ) {
    throw new Error("FAQ page object is missing required methods");
  }

  // Wait for either FAQ cards to appear or empty state to be visible
  // This ensures we don't count 0 FAQs when they're still loading
  await Promise.race([
    page
      .waitForSelector('[data-testid="faq-card"]', { timeout: 3000 })
      .catch(() => null),
    page
      .waitForSelector('[data-testid="empty-state"]', { timeout: 3000 })
      .catch(() => null),
  ]);

  const currentCount = await getCount.call(faqPage);

  if (currentCount >= minCount) {
    return currentCount;
  }

  const faqsToCreate = minCount - currentCount;
  const timestamp = Date.now();

  for (let i = 0; i < faqsToCreate; i++) {
    // Click the new FAQ button
    await expect(newButton).toBeVisible();
    await newButton.click();

    // Wait for modal to open
    await expect(faqPage.faqModal).toBeVisible();

    // Get form inputs
    const questionInput = getQuestionInput.call(faqPage, faqPage.faqModal);
    const answerInput = getAnswerInput.call(faqPage, faqPage.faqModal);
    const submitButton = getSubmitButton.call(faqPage, faqPage.faqModal);

    // Fill in the form with unique content
    const question = `Drag Test FAQ ${timestamp + i}`;
    const answer = `This FAQ was created for drag/drop testing at ${timestamp + i}`;

    await questionInput.fill(question);
    await answerInput.fill(answer);

    // Submit the form
    await submitButton.click();

    // Wait for modal to close
    await expect(faqPage.faqModal).not.toBeVisible();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000); // Allow time for FAQ to be added to the list
  }

  // Return the new count
  return await getCount.call(faqPage);
}

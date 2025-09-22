// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

export const newOrganizationFAQPage = (page: Page) => ({
  // New FAQ button
  newFAQButton: page.getByRole("button", {
    name: new RegExp(
      getEnglishText("i18n.pages._global.new_faq_aria_label"),
      "i"
    ),
  }),

  // FAQ list elements
  faqList: page.getByTestId("organization-faq-list"),
  faqCards: page.locator(".card-style"),

  // Individual FAQ card elements
  getFAQCard: (index: number) => page.locator(".card-style").nth(index),
  getFAQQuestion: (index: number) =>
    page.locator(".card-style").nth(index).getByTestId("faq-question"),
  getFAQAnswer: (index: number) =>
    page.locator(".card-style").nth(index).locator("p.select-text.text-left"),
  getFAQDragHandle: (index: number) =>
    page.locator(".card-style").nth(index).getByTestId("faq-drag-handle"),
  getFAQExpandButton: (index: number) =>
    page.locator(".card-style").nth(index).getByTestId("faq-disclosure-button"),
  getFAQEditButton: (index: number) =>
    page.locator(".card-style").nth(index).getByTestId("icon-edit"),

  // FAQ disclosure elements
  getFAQDisclosurePanel: (index: number) =>
    page
      .locator(".card-style")
      .nth(index)
      .locator('[data-headlessui-state="open"]'),
  getFAQChevronUp: (index: number) =>
    page.locator(".card-style").nth(index).getByTestId("faq-chevron-up"),
  getFAQChevronDown: (index: number) =>
    page.locator(".card-style").nth(index).getByTestId("faq-chevron-down"),

  // Empty state
  emptyState: page.getByTestId("empty-state"),
  emptyStateMessage: page.getByTestId("empty-state").locator("p, div").first(),

  // Modal elements (opened by new FAQ button)
  faqModal: page.locator("#modal").first(),
  faqModalCloseButton: (modal: Locator) =>
    modal.getByTestId("modal-close-button"),

  // Edit modal elements (opened by edit button)
  editFAQModal: page.locator("#modal").first(),
  editFAQModalCloseButton: (modal: Locator) =>
    modal.getByTestId("modal-close-button"),

  // Form elements within FAQ modal (using specific IDs from the form)
  faqQuestionInput: (modal: Locator) => modal.locator("#form-item-question"),
  faqAnswerInput: (modal: Locator) => modal.locator("#form-item-answer"),
  faqSubmitButton: (modal: Locator) => modal.locator("#form-submit-id"),

  // Utility methods
  getFAQCount: async () => {
    return await page.locator(".card-style").count();
  },

  // FAQ interaction methods
  expandFAQ: async (index: number) => {
    const expandButton = page
      .locator(".card-style")
      .nth(index)
      .getByTestId("faq-disclosure-button");
    await expandButton.click();
  },

  collapseFAQ: async (index: number) => {
    const collapseButton = page
      .locator(".card-style")
      .nth(index)
      .getByTestId("faq-disclosure-button");
    await collapseButton.click();
  },

  editFAQ: async (index: number) => {
    const editButton = page
      .locator(".card-style")
      .nth(index)
      .getByTestId("icon-edit");
    await editButton.click();
  },

  // Drag and drop methods
  getFAQDragHandlePosition: async (index: number) => {
    const dragHandle = page
      .locator(".card-style")
      .nth(index)
      .getByTestId("faq-drag-handle");
    return await dragHandle.boundingBox();
  },

  // Check if FAQ is expanded
  isFAQExpanded: async (index: number) => {
    // Use answer visibility as the most reliable indicator of expanded state
    const answer = page
      .locator(".card-style")
      .nth(index)
      .locator("p.select-text.text-left");

    return await answer.isVisible();
  },

  // Get FAQ question text
  getFAQQuestionText: async (index: number) => {
    const question = page
      .locator(".card-style")
      .nth(index)
      .getByTestId("faq-question");
    return await question.textContent();
  },

  // Get FAQ answer text
  getFAQAnswerText: async (index: number) => {
    const answer = page
      .locator(".card-style")
      .nth(index)
      .locator("p.select-text.text-left");
    return await answer.textContent();
  },
});

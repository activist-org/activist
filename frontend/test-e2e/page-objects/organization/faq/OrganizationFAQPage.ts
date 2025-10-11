// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

export const newOrganizationFAQPage = (page: Page) => ({
  // MARK: New FAQ

  newFAQButton: page.getByRole("button", {
    name: new RegExp(
      getEnglishText("i18n.pages._global.new_faq_aria_label"),
      "i"
    ),
  }),

  // MARK: FAQ List

  faqList: page.getByTestId("organization-faq-list"),
  faqCards: page.getByTestId("faq-card"),

  // MARK: FAQ Card

  getFAQCard: (index: number) => page.getByTestId("faq-card").nth(index),
  getFAQQuestion: (index: number) =>
    page.getByTestId("faq-card").nth(index).getByTestId("faq-question"),
  getFAQAnswer: (index: number) =>
    page.getByTestId("faq-card").nth(index).getByTestId("faq-answer"),
  getFAQDragHandle: (index: number) =>
    page.getByTestId("faq-card").nth(index).getByTestId("faq-drag-handle"),
  getFAQExpandButton: (index: number) =>
    page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-disclosure-button"),
  getFAQEditButton: (index: number) =>
    page.getByTestId("faq-card").nth(index).getByTestId("faq-edit-button"),

  // MARK: FAQ Disclosure

  getFAQDisclosurePanel: (index: number) =>
    page.getByTestId("faq-card").nth(index).getByTestId("faq-disclosure-panel"),
  getFAQChevronUp: (index: number) =>
    page.getByTestId("faq-card").nth(index).getByTestId("faq-chevron-up"),
  getFAQChevronDown: (index: number) =>
    page.getByTestId("faq-card").nth(index).getByTestId("faq-chevron-down"),

  // MARK: Empty State

  emptyState: page.getByTestId("empty-state"),
  emptyStateMessage: page.getByTestId("empty-state").locator("p, div").first(),

  // Modal elements (opened by new FAQ button).
  faqModal: page.locator("#modal").first(),
  faqModalCloseButton: (modal: Locator) =>
    modal.getByTestId("modal-close-button"),

  // Edit modal elements (opened by edit button).
  editFAQModal: page.locator("#modal").first(),
  editFAQModalCloseButton: (modal: Locator) =>
    modal.getByTestId("modal-close-button"),

  // Form elements within FAQ modal (using specific IDs from the form).
  faqQuestionInput: (modal: Locator) =>
    modal.getByRole("textbox", {
      name: new RegExp(
        getEnglishText("i18n.components.form_faq_entry.question"),
        "i"
      ),
    }),
  faqAnswerInput: (modal: Locator) =>
    modal.getByRole("textbox", {
      name: new RegExp(
        getEnglishText("i18n.components.form_faq_entry.answer"),
        "i"
      ),
    }),
  faqSubmitButton: (modal: Locator) =>
    modal.getByRole("button", {
      name: new RegExp(getEnglishText("i18n.components.submit"), "i"),
    }),

  // MARK: Utility

  getFAQCount: async () => {
    return await page.getByTestId("faq-card").count();
  },

  // MARK: FAQ Interaction

  expandFAQ: async (index: number) => {
    const expandButton = page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-disclosure-button");
    await expandButton.click();
  },

  collapseFAQ: async (index: number) => {
    const collapseButton = page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-disclosure-button");
    await collapseButton.click();
  },

  editFAQ: async (index: number) => {
    const editButton = page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-edit-button");
    await editButton.click();
  },

  // MARK: Drag and Drop

  getFAQDragHandlePosition: async (index: number) => {
    const dragHandle = page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-drag-handle");
    return await dragHandle.boundingBox();
  },

  // Check if FAQ is expanded.
  isFAQExpanded: async (index: number) => {
    // Use answer visibility as the most reliable indicator of expanded state.
    const answer = page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-answer");

    return await answer.isVisible();
  },

  // Get FAQ question text.
  getFAQQuestionText: async (index: number) => {
    const question = page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-question");
    return await question.textContent();
  },

  // Get FAQ answer text.
  getFAQAnswerText: async (index: number) => {
    const answer = page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-answer");
    return await answer.textContent();
  },
});

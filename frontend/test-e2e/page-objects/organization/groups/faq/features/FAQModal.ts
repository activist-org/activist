// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { getEnglishText } from "#shared/utils/i18n";

/**
 * FAQ Modal Feature
 * Handles FAQ creation/edit modal interactions.
 * @param page - The Playwright Page object representing the browser page
 * @returns An object containing locators and actions for interacting with the FAQ modal, including accessing form fields, submit button, and performing form filling and submission actions.
 */
export const FAQModal = (page: Page) => {
  return {
    // MARK: Modal Container

    get faqModal() {
      return page.locator("#modal").first();
    },

    get faqModalCloseButton() {
      return this.faqModal.getByTestId("modal-close-button");
    },

    get editFaqModal() {
      return page.locator("#modal").first();
    },

    get editFaqModalCloseButton() {
      return this.editFaqModal.getByTestId("modal-close-button");
    },

    // MARK: Form Elements

    getFaqQuestionInput(modal: Locator) {
      return modal.getByRole("textbox", {
        name: new RegExp(
          getEnglishText("i18n.components.form_faq_entry.question"),
          "i"
        ),
      });
    },

    getFaqAnswerInput(modal: Locator) {
      return modal.getByRole("textbox", {
        name: new RegExp(
          getEnglishText("i18n.components.form_faq_entry.answer"),
          "i"
        ),
      });
    },

    getFaqSubmitButton(modal: Locator) {
      return modal.getByRole("button", {
        name: new RegExp(getEnglishText("i18n.components.submit"), "i"),
      });
    },

    // MARK: Actions

    async fillFaqForm(modal: Locator, question: string, answer: string) {
      await this.getFaqQuestionInput(modal).fill(question);
      await this.getFaqAnswerInput(modal).fill(answer);
    },

    async submitFaqForm(modal: Locator) {
      await this.getFaqSubmitButton(modal).click();
    },

    async closeModal() {
      await this.faqModalCloseButton.click();
    },
  };
};
export type FAQModalType = ReturnType<typeof FAQModal>;

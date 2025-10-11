// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

/**
 * FAQ Card Feature
 * Handles individual FAQ card interactions
 */
export const FAQCard = (page: Page) => {
  return {
    // MARK: Card Selectors
    getFaqCard(index: number) {
      return page.getByTestId("faq-card").nth(index);
    },

    getFaqQuestion(index: number) {
      return page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-question");
    },

    getFaqAnswer(index: number) {
      return page.getByTestId("faq-card").nth(index).getByTestId("faq-answer");
    },

    // MARK: Interaction Elements
    getFaqDisclosureButton(index: number) {
      return page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-disclosure-button");
    },

    getFaqEditButton(index: number) {
      return page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-edit-button");
    },

    // MARK: Disclosure Elements
    getFaqDisclosurePanel(index: number) {
      return page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-disclosure-panel");
    },

    getFaqChevronUp(index: number) {
      return page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-chevron-up");
    },

    getFaqChevronDown(index: number) {
      return page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-chevron-down");
    },

    // MARK: Content Methods
    async getFaqQuestionText(index: number) {
      return await this.getFaqQuestion(index).textContent();
    },

    async getFaqAnswerText(index: number) {
      return await this.getFaqAnswer(index).textContent();
    },

    // MARK: State Checks
    async isFaqExpanded(index: number) {
      const chevronUp = this.getFaqChevronUp(index);
      return await chevronUp.isVisible();
    },

    async isFaqCollapsed(index: number) {
      const chevronDown = this.getFaqChevronDown(index);
      return await chevronDown.isVisible();
    },

    // MARK: Actions
    async clickFaqDisclosure(index: number) {
      await this.getFaqDisclosureButton(index).click();
    },

    async clickFaqEdit(index: number) {
      await this.getFaqEditButton(index).click();
    },

    async expandFaq(index: number) {
      const expandButton = page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-disclosure-button");
      await expandButton.click();
    },

    async collapseFaq(index: number) {
      const collapseButton = page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-disclosure-button");
      await collapseButton.click();
    },

    async editFaq(index: number) {
      const editButton = page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-edit-button");
      await editButton.click();
    },
  };
};
export type FAQCardType = ReturnType<typeof FAQCard>;

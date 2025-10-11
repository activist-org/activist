// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

/**
 * FAQ List Feature
 * Handles FAQ list container and collection operations
 */
export const FAQList = (page: Page) => {
  return {
    // MARK: List Container
    get faqList() {
      return page.getByTestId("organization-group-faq-list");
    },

    get faqCards() {
      return page.getByTestId("faq-card");
    },

    get firstFaqCard() {
      return this.faqCards.first();
    },

    get lastFaqCard() {
      return this.faqCards.last();
    },

    // MARK: Empty State
    get emptyState() {
      return page.getByTestId("empty-state");
    },

    get emptyStateMessage() {
      return this.emptyState.getByRole("heading", { level: 4 }).first();
    },

    // MARK: List Operations
    async getFaqCount() {
      return await this.faqCards.count();
    },

    async hasFaqEntries() {
      const count = await this.getFaqCount();
      return count > 0;
    },

    async isEmptyStateVisible() {
      return await this.emptyState.isVisible();
    },
  };
};
export type FAQListType = ReturnType<typeof FAQList>;

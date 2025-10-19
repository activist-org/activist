// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

/**
 * Resource List Feature
 * Handles resource list container and collection operations.
 */
export const ResourceList = (page: Page) => {
  return {
    // MARK: List Container

    get resourcesList() {
      return page.getByTestId("organization-group-resources-list");
    },

    get resourceCards() {
      return page.getByTestId("resource-card");
    },

    get firstResourceCard() {
      return this.resourceCards.first();
    },

    get lastResourceCard() {
      return this.resourceCards.last();
    },

    // MARK: Empty State

    get emptyState() {
      return page.getByTestId("empty-state");
    },

    get emptyStateMessage() {
      return this.emptyState.getByRole("heading", { level: 4 }).first();
    },

    // MARK: List Operations

    async getResourceCount() {
      return await this.resourceCards.count();
    },

    async hasResources() {
      const count = await this.getResourceCount();
      return count > 0;
    },

    async isEmptyStateVisible() {
      return await this.emptyState.isVisible();
    },
  };
};
export type ResourceListType = ReturnType<typeof ResourceList>;

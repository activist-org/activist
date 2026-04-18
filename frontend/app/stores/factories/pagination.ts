// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineStore } from "pinia";

/**
 * Factory function to create a pagination store with a unique ID, allowing for multiple independent pagination states across the application.
 * @param id - A unique string identifier for the pagination store, used to differentiate it from other stores created by this factory.
 * @returns A Pinia store instance with state and actions for managing pagination, including items, filters, current page, and last page status.
 */
export function createPaginationStore<TItem, TFilters>(id: string) {
  return defineStore(id, {
    state: () => ({
      items: [] as TItem[],
      filters: {} as TFilters,
      page: 1,
      isLastPage: false,
    }),
    actions: {
      getIsLastPage(): boolean {
        return this.isLastPage;
      },
      setIsLastPage(isLast: boolean) {
        this.isLastPage = isLast;
      },
      getPage(): number {
        return this.page;
      },
      setPage(page: number) {
        this.page = Math.max(1, page);
      },
      getItems(): TItem[] {
        return this.items as TItem[];
      },
      setItems(items: TItem[]) {
        (this.items as TItem[]) = items;
      },
      getFilters(): TFilters {
        return this.filters as TFilters;
      },
      setFilters(filters: TFilters) {
        (this.filters as TFilters) = filters;
      },
      clear() {
        this.items = [];
        this.page = 1;
        (this.filters as TFilters) = {} as TFilters;
      },
    },
  });
}

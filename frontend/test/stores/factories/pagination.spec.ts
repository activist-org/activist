// SPDX-License-Identifier: AGPL-3.0-or-later
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import { createPaginationStore } from "../../../app/stores/factories/pagination";

// Define some dummy types for testing the generic factory
interface DummyItem {
  id: string;
  name: string;
}

interface DummyFilters {
  search?: string;
  active?: boolean;
}

describe("createPaginationStore Factory", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // Create a test store using the factory
  const useTestListStore = createPaginationStore<DummyItem, DummyFilters>(
    "test-list"
  );

  describe("Initial State", () => {
    it("initializes with empty items array", () => {
      const store = useTestListStore();
      expect(store.items).toEqual([]);
      expect(store.getItems()).toEqual([]);
    });

    it("initializes with empty filters object", () => {
      const store = useTestListStore();
      expect(store.filters).toEqual({});
      expect(store.getFilters()).toEqual({});
    });

    it("initializes with page 1", () => {
      const store = useTestListStore();
      expect(store.page).toBe(1);
      expect(store.getPage()).toBe(1);
    });

    it("initializes with isLastPage as false", () => {
      const store = useTestListStore();
      expect(store.isLastPage).toBe(false);
      expect(store.getIsLastPage()).toBe(false);
    });
  });

  describe("Setters and Getters", () => {
    it("can set and get items", () => {
      const store = useTestListStore();
      const items: DummyItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];

      store.setItems(items);
      expect(store.items).toEqual(items);
      expect(store.getItems()).toEqual(items);
    });

    it("can set and get filters", () => {
      const store = useTestListStore();
      const filters: DummyFilters = { search: "test", active: true };

      store.setFilters(filters);
      expect(store.filters).toEqual(filters);
      expect(store.getFilters()).toEqual(filters);
    });

    it("can set and get page number", () => {
      const store = useTestListStore();
      store.setPage(5);
      expect(store.page).toBe(5);
      expect(store.getPage()).toBe(5);
    });

    it("can set and get isLastPage flag", () => {
      const store = useTestListStore();
      store.setIsLastPage(true);
      expect(store.isLastPage).toBe(true);
      expect(store.getIsLastPage()).toBe(true);
    });
  });

  describe("Edge Cases & Logic", () => {
    it("clamps page to 1 when setting to 0", () => {
      const store = useTestListStore();
      store.setPage(0);
      expect(store.page).toBe(1);
    });

    it("clamps page to 1 when setting to a negative number", () => {
      const store = useTestListStore();
      store.setPage(-5);
      expect(store.page).toBe(1);
    });

    it("clear() resets items, page, and filters but leaves isLastPage alone", () => {
      const store = useTestListStore();

      store.setItems([{ id: "1", name: "Item" }]);
      store.setFilters({ search: "query" });
      store.setPage(3);
      store.setIsLastPage(true);

      store.clear();

      expect(store.getItems()).toEqual([]);
      expect(store.getFilters()).toEqual({});
      expect(store.getPage()).toBe(1);
      // isLastPage wasn't specified in clear(), so we just ensure it behaves predictably
      // based on your implementation (currently doesn't clear isLastPage)
      expect(store.getIsLastPage()).toBe(true);
    });
  });
});

// SPDX-License-Identifier: AGPL-3.0-or-later
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import type { CommunityEvent } from "../../../shared/types/event";

import {
  useEventStore,
  useEventListStore,
} from "../../../app/stores/data/event";
import { createMockEvent, createMockEventFilters } from "../../mocks/factories";

describe("Event Stores", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // MARK: - Core Entity Store (useEventStore)
  describe("useEventStore", () => {
    it("initializes with null event", () => {
      const store = useEventStore();
      expect(store.event).toBeNull();
    });

    it("setEvent updates event state", () => {
      const store = useEventStore();
      const mockEvent = createMockEvent({
        id: "event-1",
      } as Partial<CommunityEvent>);
      store.setEvent(mockEvent);
      expect(store.event).toEqual(mockEvent);
    });

    it("getEvent returns current event", () => {
      const store = useEventStore();
      const mockEvent = createMockEvent({
        id: "event-1",
        name: "Test Event",
      } as Partial<CommunityEvent>);
      store.setEvent(mockEvent);
      expect(store.getEvent()).toEqual(mockEvent);
      expect(store.getEvent().id).toBe("event-1");
    });
  });

  // MARK: - Pagination & List Store (useEventListStore)
  describe("useEventListStore (Pagination Factory)", () => {
    describe("Initial State", () => {
      it("initializes with empty items array", () => {
        const store = useEventListStore();
        expect(store.items).toEqual([]);
      });

      it("initializes with empty filters object", () => {
        const store = useEventListStore();
        expect(store.filters).toEqual({});
      });

      it("initializes with page 1", () => {
        const store = useEventListStore();
        expect(store.page).toBe(1);
      });
    });

    describe("Actions", () => {
      it("getItems and setItems manage the list properly", () => {
        const store = useEventListStore();
        const mockEvents = [
          createMockEvent({ id: "event-1" } as Partial<CommunityEvent>),
          createMockEvent({ id: "event-2" } as Partial<CommunityEvent>),
        ];
        store.setItems(mockEvents);
        expect(store.items).toEqual(mockEvents);
        expect(store.getItems()).toHaveLength(2);
      });

      it("getFilters and setFilters manage filter state", () => {
        const store = useEventListStore();
        const mockFilters = createMockEventFilters({ name: "Test Event" });
        store.setFilters(mockFilters);
        expect(store.filters).toEqual(mockFilters);
        expect(store.getFilters()).toEqual(mockFilters);
      });

      it("getPage and setPage manage pagination", () => {
        const store = useEventListStore();
        store.setPage(5);
        expect(store.page).toBe(5);
        expect(store.getPage()).toBe(5);
      });

      it("clear resets items, filters, and page", () => {
        const store = useEventListStore();
        store.setItems([createMockEvent()]);
        store.setFilters(createMockEventFilters({ name: "Test" }));
        store.setPage(5);

        store.clear();

        expect(store.items).toEqual([]);
        expect(store.filters).toEqual({});
        expect(store.page).toBe(1);
      });
    });

    describe("Edge Cases", () => {
      it("clamps page to 1 when setting to 0", () => {
        const store = useEventListStore();
        store.setPage(5);
        store.setPage(0);
        expect(store.page).toBe(1);
        expect(store.getPage()).toBe(1);
      });

      it("clamps page to 1 when setting to negative number", () => {
        const store = useEventListStore();
        store.setPage(-1);
        expect(store.page).toBe(1);
        expect(store.getPage()).toBe(1);
      });
    });
  });

  // MARK: - Integration Checks
  describe("Cross-store Independence", () => {
    it("updates in core store do not affect list store and vice versa", () => {
      const coreStore = useEventStore();
      const listStore = useEventListStore();

      const mockEvent = createMockEvent({
        id: "event-1",
      } as Partial<CommunityEvent>);

      coreStore.setEvent(mockEvent);
      listStore.setPage(4);

      expect(coreStore.getEvent().id).toBe("event-1");
      expect(listStore.getPage()).toBe(4);

      listStore.clear();
      expect(listStore.getPage()).toBe(1);
      expect(coreStore.getEvent()).not.toBeNull();
    });
  });
});

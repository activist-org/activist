// SPDX-License-Identifier: AGPL-3.0-or-later
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import type { CommunityEvent } from "../../shared/types/event";

import { useEventStore } from "../../app/stores/event";
import { createMockEvent, createMockEventFilters } from "../mocks/factories";

describe("useEventStore", () => {
  beforeEach(() => {
    // Create fresh Pinia instance for each test to ensure isolation
    setActivePinia(createPinia());
  });

  // MARK: Initial State
  describe("Initial State", () => {
    it("initializes with null event", () => {
      const store = useEventStore();
      expect(store.event).toBeNull();
    });

    it("initializes with empty events array", () => {
      const store = useEventStore();
      expect(store.events).toEqual([]);
    });

    it("initializes with empty filters object", () => {
      const store = useEventStore();
      expect(store.filters).toEqual({});
    });

    it("initializes with page 0", () => {
      const store = useEventStore();
      expect(store.page).toBe(0);
    });
  });

  // MARK: Getter Actions
  describe("Getter Actions", () => {
    it("getEvent returns current event", () => {
      const store = useEventStore();
      const mockEvent = createMockEvent({
        id: "event-1",
      } as Partial<CommunityEvent>);
      store.setEvent(mockEvent);
      expect(store.getEvent()).toEqual(mockEvent);
    });

    it("getEvents returns current events array", () => {
      const store = useEventStore();
      const mockEvents = [
        createMockEvent({ id: "event-1" } as Partial<CommunityEvent>),
      ];
      store.setEvents(mockEvents);
      expect(store.getEvents()).toEqual(mockEvents);
    });

    it("getFilters returns current filters", () => {
      const store = useEventStore();
      const mockFilters = createMockEventFilters({ setting: "action" });
      store.setFilters(mockFilters);
      expect(store.getFilters()).toEqual(mockFilters);
    });

    it("getPage returns current page number", () => {
      const store = useEventStore();
      store.setPage(5);
      expect(store.getPage()).toBe(5);
    });
  });

  // MARK: Setter Actions
  describe("Setter Actions", () => {
    it("setEvent updates event state", () => {
      const store = useEventStore();
      const mockEvent = createMockEvent({
        id: "event-1",
      } as Partial<CommunityEvent>);
      store.setEvent(mockEvent);
      expect(store.event).toEqual(mockEvent);
    });

    it("setEvents updates events array", () => {
      const store = useEventStore();
      const mockEvents = [
        createMockEvent({ id: "event-1" } as Partial<CommunityEvent>),
        createMockEvent({ id: "event-2" } as Partial<CommunityEvent>),
      ];
      store.setEvents(mockEvents);
      expect(store.events).toEqual(mockEvents);
      expect(store.events).toHaveLength(2);
    });

    it("setFilters updates filters object", () => {
      const store = useEventStore();
      const mockFilters = createMockEventFilters({
        setting: "learn",
        locationType: "offline",
      });
      store.setFilters(mockFilters);
      expect(store.filters).toEqual(mockFilters);
    });

    it("setPage updates page number", () => {
      const store = useEventStore();
      store.setPage(10);
      expect(store.page).toBe(10);
    });
  });

  // MARK: Integration Tests
  describe("Integration Tests", () => {
    it("setting event then getting it returns the same event", () => {
      const store = useEventStore();
      const mockEvent = createMockEvent({
        id: "event-1",
        name: "Test Event",
      } as Partial<CommunityEvent>);
      store.setEvent(mockEvent);
      expect(store.getEvent()).toEqual(mockEvent);
      expect(store.getEvent().id).toBe("event-1");
    });

    it("setting events array then getting it returns the same array", () => {
      const store = useEventStore();
      const mockEvents = [
        createMockEvent({ id: "event-1" } as Partial<CommunityEvent>),
        createMockEvent({ id: "event-2" } as Partial<CommunityEvent>),
      ];
      store.setEvents(mockEvents);
      expect(store.getEvents()).toEqual(mockEvents);
      expect(store.getEvents()).toHaveLength(2);
    });

    it("setting filters then getting them returns the same filters", () => {
      const store = useEventStore();
      const mockFilters = createMockEventFilters({
        setting: "action",
        locationType: "online",
        name: "test",
      });
      store.setFilters(mockFilters);
      expect(store.getFilters()).toEqual(mockFilters);
    });

    it("setting page then getting it returns the same page", () => {
      const store = useEventStore();
      store.setPage(3);
      expect(store.getPage()).toBe(3);
      expect(store.page).toBe(3);
    });

    it("can set event independently of events array", () => {
      const store = useEventStore();
      const singleEvent = createMockEvent({
        id: "event-single",
      } as Partial<CommunityEvent>);
      const eventsArray = [
        createMockEvent({ id: "event-1" } as Partial<CommunityEvent>),
        createMockEvent({ id: "event-2" } as Partial<CommunityEvent>),
      ];

      store.setEvent(singleEvent);
      store.setEvents(eventsArray);

      expect(store.getEvent()).toEqual(singleEvent);
      expect(store.getEvents()).toEqual(eventsArray);
      expect(store.event.id).toBe("event-single");
      expect(store.events).toHaveLength(2);
    });

    it("can update filters without affecting other state", () => {
      const store = useEventStore();
      const mockEvent = createMockEvent({
        id: "event-1",
      } as Partial<CommunityEvent>);
      const mockEvents = [mockEvent];
      const mockFilters = createMockEventFilters({ setting: "action" });

      store.setEvent(mockEvent);
      store.setEvents(mockEvents);
      store.setPage(5);
      store.setFilters(mockFilters);

      // Verify all state remains intact
      expect(store.getEvent()).toEqual(mockEvent);
      expect(store.getEvents()).toEqual(mockEvents);
      expect(store.getPage()).toBe(5);
      expect(store.getFilters()).toEqual(mockFilters);
    });
  });

  // MARK: Edge Cases
  describe("Edge Cases", () => {
    it("handles setting empty events array", () => {
      const store = useEventStore();
      store.setEvents([createMockEvent()]);
      store.setEvents([]);
      expect(store.events).toEqual([]);
      expect(store.getEvents()).toHaveLength(0);
    });

    it("handles setting empty filters object", () => {
      const store = useEventStore();
      store.setFilters(createMockEventFilters({ setting: "action" }));
      store.setFilters({});
      expect(store.filters).toEqual({});
    });

    it("can set page to 0", () => {
      const store = useEventStore();
      store.setPage(5);
      store.setPage(0);
      expect(store.page).toBe(0);
      expect(store.getPage()).toBe(0);
    });

    it("can set page to negative number", () => {
      const store = useEventStore();
      store.setPage(-1);
      expect(store.page).toBe(-1);
      expect(store.getPage()).toBe(-1);
    });
    it("can set page to large number", () => {
      const store = useEventStore();
      store.setPage(999);
      expect(store.page).toBe(999);
      expect(store.getPage()).toBe(999);
    });
  });
});

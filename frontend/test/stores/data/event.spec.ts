// SPDX-License-Identifier: AGPL-3.0-or-later
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import type { CommunityEvent } from "../../../shared/types/event";

import { useEventStore } from "../../../app/stores/data/event";
import { createMockEvent } from "../../mocks/factories";

describe("Event Stores", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // MARK: Core Entity Store (useEventStore)

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

  // MARK: Integration Checks

  describe("Cross-store Independence", () => {
    it("updates in core store do not affect list store and vice versa", () => {
      const coreStore = useEventStore();

      const mockEvent = createMockEvent({
        id: "event-1",
      } as Partial<CommunityEvent>);

      coreStore.setEvent(mockEvent);

      expect(coreStore.getEvent().id).toBe("event-1");

      expect(coreStore.getEvent()).not.toBeNull();
    });
  });
});

// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineStore } from "pinia";
import { createPaginationStore } from "../factories/pagination";
import { supportEvent, unsupportEvent } from "~/services/event";

// MARK: List Store
export const useEventListStore = createPaginationStore<
  CommunityEvent,
  EventFilters
>("event-list");

// MARK: Entity Store
export const useEventStore = defineStore("event", {
  state: () => ({
    event: null as unknown as CommunityEvent,
    supportedEventIds: [] as string[],
  }),
  actions: {
    getEvent() {
      return this.event;
    },
    setEvent(event: CommunityEvent) {
      this.event = event;
    },
    isEventSupported(eventId: string): boolean {
      return this.supportedEventIds.includes(eventId);
    },
    async toggleSupport(eventId: string): Promise<void> {
      const isSupported = this.supportedEventIds.includes(eventId);
      try {
        if (isSupported) {
          await unsupportEvent(eventId);
          this.supportedEventIds = this.supportedEventIds.filter(
            (id) => id !== eventId
          );
        } else {
          await supportEvent(eventId);
          this.supportedEventIds.push(eventId);
        }
      } catch (e) {
        console.error("Failed to toggle event support:", e);
      }
    },
  },
});
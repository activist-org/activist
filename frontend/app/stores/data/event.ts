// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineStore } from "pinia";
import { createPaginationStore } from "../factories/pagination";
import { favoriteEvent, unfavoriteEvent } from "~/services/event";

// MARK: List Store
export const useEventListStore = createPaginationStore<
  CommunityEvent,
  EventFilters
>("event-list");

// MARK: Entity Store
export const useEventStore = defineStore("event", {
  state: () => ({
    event: null as unknown as CommunityEvent,
    favoritedEventIds: [] as string[],
  }),
  actions: {
    getEvent() {
      return this.event;
    },
    setEvent(event: CommunityEvent) {
      this.event = event;
    },
    isEventFavorited(eventId: string): boolean {
      return this.favoritedEventIds.includes(eventId);
    },
    async toggleFavorite(eventId: string): Promise<void> {
      const isFavorited = this.favoritedEventIds.includes(eventId);
      try {
        if (isFavorited) {
          await unfavoriteEvent(eventId);
          this.favoritedEventIds = this.favoritedEventIds.filter(
            (id) => id !== eventId
          );
        } else {
          await favoriteEvent(eventId);
          this.favoritedEventIds.push(eventId);
        }
      } catch (e) {
        console.error("Failed to toggle event favorite:", e);
      }
    },
  },
});
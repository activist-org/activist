// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineStore } from "pinia";

import { createPaginationStore } from "../factories/pagination";

// 1. The List/Pagination Store
export const useEventListStore = createPaginationStore<
  CommunityEvent,
  EventFilters
>("event-list");

// 3. The Core Entity Store (Now it only cares about the single active event)
export const useEventStore = defineStore("event", {
  state: () => ({
    event: null as unknown as CommunityEvent,
  }),
  actions: {
    getEvent() {
      return this.event;
    },
    setEvent(event: CommunityEvent) {
      this.event = event;
    },
  },
});

// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineStore } from "pinia";

// MARK: Entity Store

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

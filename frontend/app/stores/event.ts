// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Event } from "~/types/events/event";

interface EventStore {
  event: Event;
  events: Event[];
}

export const useEventStore = defineStore("event", {
  // MARK: Properties

  state: (): EventStore => ({
    event: null as unknown as Event,
    events: [],
  }),
  actions: {
    setEvent(event: Event) {
      this.event = event;
    },

    getEvent(): Event {
      return this.event;
    },
    setEvents(events: Event[]) {
      this.events = events;
    },

    getEvents(): Event[] {
      return this.events;
    },
  },
});

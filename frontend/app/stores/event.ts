// SPDX-License-Identifier: AGPL-3.0-or-later

interface EventStore {
  event: Activity;
  events: Activity[];
  filters: EventFilters;
  page: number;
}

export const useEventStore = defineStore("event", {
  // MARK: Properties

  state: (): EventStore => ({
    event: null as unknown as Activity,
    events: [],
    filters: {} as EventFilters,
    page: 0,
  }),
  actions: {
    setEvent(event: Activity) {
      this.event = event;
    },

    getPage(): number {
      return this.page;
    },
    setPage(page: number) {
      this.page = page;
    },

    getEvent(): Activity {
      return this.event;
    },
    setEvents(events: Activity[]) {
      this.events = events;
    },

    getEvents(): Activity[] {
      return this.events;
    },
    setFilters(filters: EventFilters) {
      this.filters = filters;
    },

    getFilters(): EventFilters {
      return this.filters;
    },
  },
});

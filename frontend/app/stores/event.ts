// SPDX-License-Identifier: AGPL-3.0-or-later
interface EventStore {
  event: CommunityEvent;
  events: CommunityEvent[];
  filters: EventFilters;
  page: number;
}

export const useEventStore = defineStore("event", {
  // MARK: Properties

  state: (): EventStore => ({
    event: null as unknown as CommunityEvent,
    events: [],
    filters: {} as EventFilters,
    page: 0,
  }),
  actions: {
    setEvent(event: CommunityEvent) {
      this.event = event;
    },

    getPage(): number {
      return this.page;
    },
    setPage(page: number) {
      this.page = page;
    },

    getEvent(): CommunityEvent {
      return this.event;
    },
    setEvents(events: CommunityEvent[]) {
      this.events = events;
    },

    getEvents(): CommunityEvent[] {
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

// SPDX-License-Identifier: AGPL-3.0-or-later

export const getKeyForGetEvents = () => `events-list`;

export function useGetEvents(
  filters: Ref<EventFilters> | ComputedRef<EventFilters>
) {
  const store = useEventStore();
  const page = ref(1);
  const isLastPageRef = ref(false);
  const { showToastError } = useToaster();
  const eventFilters = computed(() => unref(filters));
  // UseAsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<Activity[]>(
    () => getKeyForGetEvents(),
    async () => {
      try {
        const { data: events, isLastPage } = await listEvents({
          ...eventFilters.value,
          page:
            JSON.stringify(store.getFilters()) ===
            JSON.stringify(eventFilters.value)
              ? page.value
              : 1,
          page_size: 10,
        });
        const eventsCached = store.getEvents();
        const pageCached = store.getPage();
        isLastPageRef.value = isLastPage;

        // Append new events to cached events if page > 1.
        if (
          eventsCached.length > 0 &&
          JSON.stringify(store.getFilters()) ===
            JSON.stringify(eventFilters.value) &&
          page.value > pageCached
        ) {
          store.setEvents([...eventsCached, ...events]);
          return [...eventsCached, ...events] as Activity[];
        }
        store.setEvents(events);
        // Reset to page 1 if filters changed.
        if (
          JSON.stringify(store.getFilters()) !==
          JSON.stringify(eventFilters.value)
        ) {
          store.setPage(1);
          page.value = 1;
        } else {
          store.setPage(page.value);
        }
        store.setFilters(eventFilters.value);
        return events as Activity[];
      } catch (error) {
        showToastError((error as AppError).message);
        throw error;
      }
    },
    {
      watch: [eventFilters, page],
      immediate: true,
      getCachedData: (key, nuxtApp) => {
        // Return cached data from store if available and filters/page match.
        if (
          store.getEvents().length > 0 &&
          JSON.stringify(store.getFilters()) ===
            JSON.stringify(eventFilters.value) &&
          page.value === store.getPage()
        ) {
          return store.getEvents();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      },
      default: () => [],
    }
  );

  const getMore = () => {
    if (isLastPageRef.value) return;
    page.value += 1;
  };

  return {
    data,
    pending,
    error,
    refresh,
    filters: eventFilters.value,
    getMore,
  };
}

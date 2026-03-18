// SPDX-License-Identifier: AGPL-3.0-or-later

export const getKeyForGetEvents = () => `events-list`;

export function useGetEvents(
  filters: Ref<EventFilters> | ComputedRef<EventFilters>
) {
  const store = useEventListStore();
  const page = ref(1);
  const { showToastError } = useToaster();
  const eventFilters = computed(() => unref(filters));
  // UseAsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<CommunityEvent[]>(
    () => getKeyForGetEvents(),
    async () => {
      try {
        if (
          JSON.stringify(store.getFilters()) ===
            JSON.stringify(eventFilters.value) &&
          store.getIsLastPage()
        ) {
          return store.getItems();
        }
        const { data: events, isLastPage } = await listEvents({
          ...eventFilters.value,
          page:
            JSON.stringify(store.getFilters()) ===
            JSON.stringify(eventFilters.value)
              ? page.value
              : 1,
          page_size: 10,
        });
        const eventsCached = store.getItems();
        const pageCached = store.getPage();

        // Append new events to cached events if page > 1.
        if (
          eventsCached.length > 0 &&
          JSON.stringify(store.getFilters()) ===
            JSON.stringify(eventFilters.value) &&
          page.value > pageCached
        ) {
          store.setItems([...eventsCached, ...events]);
          store.setIsLastPage(isLastPage);
          return [...eventsCached, ...events] as CommunityEvent[];
        }
        store.setItems(events);
        store.setIsLastPage(isLastPage);
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
        return events as CommunityEvent[];
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
          store.getItems().length > 0 &&
          JSON.stringify(store.getFilters()) ===
            JSON.stringify(eventFilters.value) &&
          page.value === store.getPage()
        ) {
          return store.getItems();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      },
      default: () => [],
    }
  );

  const getMore = () => {
    if (store.getIsLastPage()) return;
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

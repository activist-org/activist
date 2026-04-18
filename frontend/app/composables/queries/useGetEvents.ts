// SPDX-License-Identifier: AGPL-3.0-or-later

export const getKeyForGetEvents = () => `events-list`;

/**
 * Composable for fetching and managing the list of events in the frontend application. This composable uses the useAsyncData hook to fetch the list of events from the server based on the provided filters and pagination, handle loading and error states, and cache the data for efficient retrieval. The fetched events are stored in a Vuex store using the useEventListStore composable, allowing other components to access and reactively update based on the list of events. The composable also integrates error handling using the useAppError composable to manage any errors that occur during the data fetching process. Additionally, it provides a getMore function to fetch additional pages of events when pagination is supported by the API.
 * @param filters A reactive reference or computed reference containing the filters to be applied when fetching the list of events, allowing the composable to reactively update the fetched data based on changes to the filters.
 * @returns An object containing the data (list of events), pending state, error state, a refresh function for managing the fetching and state of events in the application, the current filters applied, and a getMore function for fetching additional pages of events.
 */
export function useGetEvents(
  filters: Ref<EventFilters> | ComputedRef<EventFilters>
) {
  const store = useEventListStore();
  const page = ref(1);
  const { handleError } = useAppError();
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
          (page.value > pageCached || (page.value === 1 && pageCached === 1))
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
      } catch (err) {
        handleError(err);
        throw err;
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

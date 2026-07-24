// SPDX-License-Identifier: AGPL-3.0-or-later

export function useGetEvents(
  filters: Ref<EventFilters> | ComputedRef<EventFilters>
) {
  const store = useEventListStore();
  const { handleError, error: appError } = useAppError();
  const { getKeyForGetEvents } = useEventCache();

  const eventFilters = computed(() => unref(filters));

  const isSameFilters = computed(
    () => JSON.stringify(store.getFilters()) === JSON.stringify(eventFilters.value)
  );

  const page = ref(isSameFilters.value ? store.getPage() : 1);

  const { data, isLoading, error, refetch } = useQuery({
    key: () => getKeyForGetEvents(eventFilters.value),
    query: async () => {
      console.log("Fetching events with filters:", eventFilters.value, "page:", page.value);

      if (!isSameFilters.value) {
        console.log("Filters changed, resetting page to 1 and clearing store");
        page.value = 1;
        store.clear();
      }

      const targetPage = page.value;

      const { data: events, isLastPage } = await listEvents({
        ...eventFilters.value,
        page: targetPage,
        page_size: 10,
      });

      store.setIsLastPage(isLastPage);
      store.setPage(targetPage);
      store.setFilters(eventFilters.value);

      const eventsCached = store.getItems();

      // FIX 1: strictly greater than 1 (targetPage > 1)
      if (targetPage > 1 && isSameFilters.value) {
        const combinedEvents = [...eventsCached, ...events];
        store.setItems(combinedEvents);
        return combinedEvents;
      }

      // For page 1, strictly replace the items
      store.setItems(events);
      return events;
    },
  });

  watch(error, (err) => {
    if (err) {
      handleError(err);
    }
  });

  watch(
    eventFilters,
    (newFilters, oldFilters) => {
      if (JSON.stringify(newFilters) !== JSON.stringify(oldFilters)) {
        page.value = 1;
      }
    },
    { deep: true }
  );

  // FIX 2: Custom refresh wrapper to reset to page 1
  const refreshList = async () => {
    page.value = 1;
    await refetch();
  };

  const getMore = async () => {
    if (store.getIsLastPage() || isLoading.value) return;
    page.value += 1;
    await refetch();
  };

  return {
    data,
    pending: isLoading,
    error: appError,
    refresh: refreshList, // Export the wrapper, not the raw query method
    filters: eventFilters.value,
    getMore,
  };
}

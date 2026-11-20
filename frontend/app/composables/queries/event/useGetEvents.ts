// SPDX-License-Identifier: AGPL-3.0-or-later
export function useGetEvents(
  filters: Ref<EventFilters> | ComputedRef<EventFilters>
) {
  const { getKeyForEvents, invalidateEventList } = useEventCache();

  const eventFilters = computed(() => unref(filters));

  const key = computed(() => getKeyForEvents({ ...eventFilters.value }));

  const { data, pending, error, getMore, refresh } =
    useCustomInfiniteQuery<CommunityEvent>(
      key,
      invalidateEventList,
      async ({ page, page_size }) => {
        return listEvents({
          ...eventFilters.value,
          page: page,
          page_size: page_size,
        });
      }
    );
  return {
    data,
    pending: pending,
    error,
    refresh,
    filters: readonly(eventFilters.value),
    getMore,
  };
}

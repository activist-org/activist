// SPDX-License-Identifier: AGPL-3.0-or-later
export function useGetEvents(
  filters: Ref<EventFilters> | ComputedRef<EventFilters>
) {
  const { handleError, error: appError } = useAppError();
  const { getKeyForEvents, invalidateEventList } = useEventCache();

  const eventFilters = computed(() => unref(filters));

  const { data, isLoading, error, loadNextPage } = useInfiniteQuery({
    initialPageParam: 1,
    key: () => getKeyForEvents({ ...eventFilters.value }),
    getNextPageParam: (lastPage, allPages) => {
      if ((lastPage as EventsPaginatedResponse).isLastPage) return null;
      return allPages.length + 1; // Or (lastPageParam as number) + 1
    },
    query: async ({ pageParam }) => {
      if (!pageParam) return { data: [], isLastPage: true };
      return listEvents({
        ...eventFilters.value,
        page: pageParam,
        page_size: 10,
      });
    },
  });

  watch(error, (err) => {
    if (err) {
      handleError(err);
    }
  });

  const refreshList = async () => {
    await invalidateEventList();
  };

  return {
    data: computed(() => {
      return (data?.value?.pages ?? []).flatMap(
        (p) => (p as EventsPaginatedResponse).data
      );
    }),
    pending: readonly(isLoading),
    error: appError,
    refresh: refreshList,
    filters: readonly(eventFilters.value),
    getMore: loadNextPage,
  };
}

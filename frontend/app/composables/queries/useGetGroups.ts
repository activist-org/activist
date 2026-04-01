// SPDX-License-Identifier: AGPL-3.0-or-later
export const getKeyForGetGroups = (filters: GroupFilters, page: number) =>
  `groups-list:filters:${JSON.stringify(filters)}:page:${page}`;

/**
 * Composable for fetching and managing the list of groups in the frontend application. This composable uses the useAsyncData hook to fetch the list of groups from the server based on the provided filters and pagination, handle loading and error states, and cache the data for efficient retrieval. The fetched groups are stored in a local ref, allowing other components to access and reactively update based on the list of groups. The composable also integrates error handling using the useAppError composable to manage any errors that occur during the data fetching process. Additionally, it provides a getMore function to fetch additional pages of groups when pagination is supported by the API.
 * @param filters A reactive reference containing the filters to be applied when fetching the list of groups, allowing the composable to reactively update the fetched data based on changes to the filters.
 * @returns An object containing the data (list of groups), pending state, error state, a refresh function for managing the fetching and state of groups in the application, and a getMore function for fetching additional pages of groups.
 */
export function useGetGroups(filters: MaybeRef<GroupFilters>) {
  const { handleError } = useAppError();
  const isLastPageRef = ref(false);
  const groups = ref<Group[]>([]);
  const page = ref(1);
  const filtersRef = computed(() => {
    isLastPageRef.value = false;
    return unref(filters);
  });
  // UseAsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<Group[]>(
    () => getKeyForGetGroups(filtersRef.value, page.value),
    async () => {
      try {
        if (!filtersRef.value || Object.keys(filtersRef.value).length === 0) {
          return [];
        }
        if (isLastPageRef.value) {
          return groups.value as Group[];
        }
        const paginatedGroups = await listGroups({
          ...filtersRef.value,
          page: page.value,
          page_size: 10,
        });
        isLastPageRef.value = paginatedGroups.isLastPage;
        return [...groups.value, ...paginatedGroups.data] as Group[];
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    {
      watch: [page, filtersRef],
      default: () => [],
    }
  );
  const getMore = async () => {
    if (isLastPageRef.value) {
      return;
    }
    page.value += 1;
  };
  return {
    data,
    pending,
    error,
    refresh,
    getMore,
  };
}

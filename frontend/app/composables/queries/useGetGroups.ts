// SPDX-License-Identifier: AGPL-3.0-or-later
export const getKeyForGetGroups = (filters: GroupFilters, page: number) =>
  `groups-list:filters:${JSON.stringify(filters)}:page:${page}`;

export function useGetGroups(filters: MaybeRef<GroupFilters>) {
  const { showToastError } = useToaster();
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
        showToastError((error as AppError).message);
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

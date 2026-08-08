// SPDX-License-Identifier: AGPL-3.0-or-later
export const getKeyForGetGroups = (filters: GroupFilters, page: number) =>
  `groups-list:filters:${JSON.stringify(filters)}:page:${page}`;

export function useGetGroups(filters: MaybeRef<GroupFilters>) {
  const { handleError } = useAppError();
  const isLastPageRef = ref(false);
  const groups = ref<Group[]>([]);
  const page = ref(1);
  const filtersRef = computed(() => unref(filters));
  const oldFilters = ref<GroupFilters | undefined>(filtersRef.value);
  const isFinished = ref(true);
  // UseAsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<Group[]>(
    () => getKeyForGetGroups(filtersRef.value, page.value),
    async () => {
      try {
        if (!filtersRef.value || Object.keys(filtersRef.value).length === 0) {
          return groups.value as Group[];
        }
        if (
          JSON.stringify(oldFilters.value) !== JSON.stringify(filtersRef.value)
        ) {
          oldFilters.value = filtersRef.value;
          page.value = 1;
          groups.value = [];
        }
        isFinished.value = false;
        const paginatedGroups = await listGroups({
          ...filtersRef.value,
          page: page.value,
          page_size: 10,
        });
        isFinished.value = true;
        isLastPageRef.value = paginatedGroups.isLastPage;
        const newGroups = paginatedGroups.data.filter(
          (newGroup) =>
            !groups.value.some(
              (existingGroup) => existingGroup.id === newGroup.id
            )
        );
        groups.value = groups.value.concat(newGroups);
        return groups.value as Group[];
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
    if (
      isLastPageRef.value ||
      JSON.stringify(oldFilters.value) !== JSON.stringify(filtersRef.value) ||
      !isFinished.value
    ) {
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

// SPDX-License-Identifier: AGPL-3.0-or-later
export function useGetOrganizations(
  filters: Ref<OrganizationFilters> | ComputedRef<OrganizationFilters>
) {
  const { handleError, error: appError } = useAppError();
  const { getKeyForOrganizations, invalidateOrganizationList } =
    useOrganizationCache();

  const organizationFilters = computed(() => unref(filters));

  const { data, isLoading, error, loadNextPage } = useInfiniteQuery({
    initialPageParam: 1,
    key: () => getKeyForOrganizations({ ...organizationFilters.value }),
    getNextPageParam: (lastPage, allPages) => {
      if ((lastPage as OrganizationPaginatedResponse).isLastPage) return null;
      return allPages.length + 1; // Or (lastPageParam as number) + 1
    },
    query: async ({ pageParam }) => {
      if (!pageParam) return { organizations: [], isLastPage: true };
      return await listOrganizations({
        ...organizationFilters.value,
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
    await invalidateOrganizationList();
  };

  return {
    data: computed(() => {
      return (data?.value?.pages ?? []).flatMap(
        (p) => (p as OrganizationPaginatedResponse).data
      );
    }),
    pending: readonly(isLoading),
    error: appError,
    refresh: refreshList,
    filters: readonly(organizationFilters.value),
    getMore: loadNextPage,
  };
}

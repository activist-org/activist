// SPDX-License-Identifier: AGPL-3.0-or-later
export function useGetOrganizationsByUser(
  userId: MaybeRef<string>,
  filters: MaybeRef<OrganizationFilters> = {}
) {
  const { handleError, error: appError } = useAppError();
  const { getKeyForOrganizationsByUser, invalidateOrganizationsByUser } =
    useOrganizationCache();

  const organizationFilters = computed(() => unref(filters));

  const { data, isLoading, error, loadNextPage } = useInfiniteQuery({
    initialPageParam: 1,
    key: () =>
      getKeyForOrganizationsByUser(unref(userId), {
        ...organizationFilters.value,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if ((lastPage as OrganizationPaginatedResponse).isLastPage) return null;
      return allPages.length + 1; // Or (lastPageParam as number) + 1
    },
    query: async ({ pageParam }) => {
      if (!pageParam) return { organizations: [], isLastPage: true };
      return await listOrganizationsByUserId(unref(userId), {
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
    await invalidateOrganizationsByUser(unref(userId));
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
    filters: readonly(unref(organizationFilters)),
    getMore: loadNextPage,
  };
}

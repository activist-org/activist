// SPDX-License-Identifier: AGPL-3.0-or-later
export function useGetOrganizationEvents(
  id: MaybeRef<string>,
  filters?: MaybeRef<OrganizationEventFilters>
) {
  const { handleError, error: appError } = useAppError();
  const { getKeyForOrganizationEvents, invalidateOrganizationEvents } =
    useOrganizationCache();

  const orgId = computed(() => String(unref(id)));
  const organizationEventFilters = computed(() => unref(filters) ?? {});

  const { data, isLoading, error, loadNextPage } = useInfiniteQuery({
    initialPageParam: 1,
    key: () =>
      getKeyForOrganizationEvents(orgId.value, {
        ...organizationEventFilters.value,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if ((lastPage as EventsPaginatedResponse).isLastPage) return null;
      return allPages.length + 1;
    },
    query: async ({ pageParam }) => {
      if (!pageParam || !orgId.value) return { data: [], isLastPage: true };
      return listOrganizationEvents(orgId.value, {
        ...organizationEventFilters.value,
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
    if (!orgId.value) {
      return;
    }
    await invalidateOrganizationEvents(orgId.value);
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
    filters: readonly(organizationEventFilters.value),
    getMore: loadNextPage,
  };
}

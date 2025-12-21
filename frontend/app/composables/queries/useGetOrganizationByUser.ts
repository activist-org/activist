// SPDX-License-Identifier: AGPL-3.0-or-later
export const getKeyForGetOrganizationsByUser = (
  userId: string,
  page: number,
  filters?: OrganizationFilters
) =>
  `organizations-by-user-${userId}:page:${page}:filters:${JSON.stringify(filters)}`;

export function useGetOrganizationsByUser(
  userId: string,
  filters?: MaybeRef<OrganizationFilters>
) {
  const { showToastError } = useToaster();
  const isLastPageRef = ref(false);
  const organizations = ref<Organization[]>([]);
  const page = ref(1);
  const userIdRef = computed(() => userId);
  const filtersRef = computed(() => unref(filters));

  // UseAsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<Organization[]>(
    () => getKeyForGetOrganizationsByUser(userId, page.value, filtersRef.value),
    async () => {
      try {
        if (!userIdRef.value || userIdRef.value === "") {
          return [];
        }
        const paginatedOrganizations = await listOrganizationsByUserId(
          userIdRef.value,
          page.value,
          filtersRef.value
        );
        isLastPageRef.value = paginatedOrganizations.isLastPage;
        return [
          ...organizations.value,
          ...paginatedOrganizations.data,
        ] as Organization[];
      } catch (error) {
        showToastError((error as AppError).message);
        throw error;
      }
    },
    {
      watch: [page, userIdRef, filtersRef],
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

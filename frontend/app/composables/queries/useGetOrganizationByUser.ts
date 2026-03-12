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
  const oldFilters = ref<OrganizationFilters | undefined>(filtersRef.value);
  const isFinished = ref(true);
  // UseAsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<Organization[]>(
    () => getKeyForGetOrganizationsByUser(userId, page.value, filtersRef.value),
    async () => {
      try {
        if (
          !userIdRef.value ||
          (userIdRef.value === "" && !isLastPageRef.value)
        ) {
          return organizations.value as Organization[];
        }
        if (
          JSON.stringify(oldFilters.value) !== JSON.stringify(filtersRef.value)
        ) {
          oldFilters.value = filtersRef.value;
          page.value = 1;
          organizations.value = [];
        }
        isFinished.value = false;
        const paginatedOrganizations = await listOrganizationsByUserId(
          userIdRef.value,
          page.value,
          filtersRef.value
        );
        isFinished.value = true;
        isLastPageRef.value = paginatedOrganizations.isLastPage;
        const newOrgs = paginatedOrganizations.data.filter(
          (newOrg) =>
            !organizations.value.some(
              (existingOrg) => existingOrg.id === newOrg.id
            )
        );
        organizations.value = organizations.value.concat(newOrgs);
        return organizations.value as Organization[];
      } catch (error) {
        showToastError((error as AppError).message);
        throw error;
      }
    },
    {
      watch: [userIdRef, filtersRef],
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
    page,
    organizations,
  };
}

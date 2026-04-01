// SPDX-License-Identifier: AGPL-3.0-or-later
export const getKeyForGetOrganizationsByUser = (
  userId: string,
  page: number,
  filters?: OrganizationFilters
) =>
  `organizations-by-user-${userId}:page:${page}:filters:${JSON.stringify(filters)}`;

/**
 * Composable for fetching and managing the list of organizations associated with a specific user in the frontend application. This composable uses the useAsyncData hook to fetch the organizations from the server based on the provided user ID and optional filters, handle loading and error states, and cache the data for efficient retrieval. The fetched organizations are stored in a local ref, allowing other components to access and reactively update based on the list of organizations. The composable also integrates error handling using the useAppError composable to manage any errors that occur during the data fetching process. Additionally, it provides a getMore function to fetch additional pages of organizations when pagination is supported by the API.
 * @param userId The ID of the user for whom to fetch the associated organizations, used as a parameter in the API request to retrieve the relevant organizations for that user.
 * @param filters An optional reactive reference or computed reference containing the filters to be applied when fetching the list of organizations, allowing the composable to reactively update the fetched data based on changes to the filters.
 * @returns An object containing the data (list of organizations), pending state, error state, a refresh function for managing the fetching and state of organizations in the application, the current page number for pagination, and a getMore function for fetching additional pages of organizations.
 */
export function useGetOrganizationsByUser(
  userId: string,
  filters?: MaybeRef<OrganizationFilters>
) {
  const { handleError } = useAppError();
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
        handleError(error);
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

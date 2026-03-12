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

        if (page.value === 1) {
          organizations.value = paginatedOrganizations.data;
        } else {
          organizations.value = [
            ...organizations.value,
            ...paginatedOrganizations.data,
          ];
        }
        return organizations.value;
      } catch (error: unknown) {
        const typedError = error as { response?: { status?: number }; message?: string };
        const isInvalidPage = typedError?.response?.status === 404 || typedError?.message?.includes("Invalid page");
        if (isInvalidPage) {
          isLastPageRef.value = true;
          if (page.value === 1) {
            organizations.value = [];
          }
          return organizations.value;
        }

        showToastError((error as any).message || "An error occurred");
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
    page,
    organizations
  };
}

// SPDX-License-Identifier: AGPL-3.0-or-later
export const getKeyForGetOrganizationsByUser = (userId: string, page:number) => `organizations-by-user-${userId}:page:${page}`;

export function useGetOrganizationsByUser(userId: string) {
  const { showToastError } = useToaster();
  const isLastPageRef = ref(false);
  const organizations = ref<Organization[]>([]);
  const page = ref(1);
  const userIdRef = computed(() => userId);
  // UseAsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<Organization[]>(
    () => getKeyForGetOrganizationsByUser(userId,page.value),
    async () => {
      try {
        if (!userIdRef.value || userIdRef.value === '') {
          return [];
        }
        if (isLastPageRef.value) {
          return organizations.value as Organization[];
        }
        const paginatedOrganizations = await listOrganizationsByUserId(userIdRef.value, page.value);
        isLastPageRef.value = paginatedOrganizations.isLastPage;
        return [...organizations.value, ...paginatedOrganizations.data] as Organization[];
      } catch (error) {
        showToastError((error as AppError).message);
        throw error;
      }
    },
    {
      watch: [page, userIdRef],
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

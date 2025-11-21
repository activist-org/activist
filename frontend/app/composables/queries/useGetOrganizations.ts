// SPDX-License-Identifier: AGPL-3.0-or-later
export const getKeyForGetOrganizations = (filters: OrganizationFilters) =>
  `organizations-list:${JSON.stringify(filters)}`;

export function useGetOrganizations(
  filters: Ref<OrganizationFilters> | ComputedRef<OrganizationFilters>
) {
  const store = useOrganizationStore();
  const page = ref(1);
  const isLastPageRef = ref(false);
  const { showToastError } = useToaster();
  const orgFilters = computed(() => unref({ ...filters }));
  // Use AsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<Organization[]>(
    () => getKeyForGetOrganizations(orgFilters.value),
    async () => {
      try {
        const { data: organizations, isLastPage } = await listOrganizations({
          ...orgFilters.value,
          page:
            JSON.stringify(store.getFilters()) ===
            JSON.stringify(orgFilters.value)
              ? page.value
              : 1,
          page_size: 10,
        });
        const organizationsCached = store.getOrganizations();
        const pageCached = store.getPage();
        isLastPageRef.value = isLastPage;

        // Append new events to cached events if page > 1
        if (
          organizationsCached.length > 0 &&
          JSON.stringify(store.getFilters()) ===
            JSON.stringify(orgFilters.value) &&
          page.value > pageCached
        ) {
          store.setOrganizations([...organizationsCached, ...organizations]);
          return [...organizationsCached, ...organizations] as Organization[];
        }

        store.setOrganizations(organizations);
        if (
          JSON.stringify(store.getFilters()) !==
          JSON.stringify(orgFilters.value)
        ) {
          store.setPage(1);
          page.value = 1;
        } else {
          store.setPage(page.value);
        }

        store.setFilters(orgFilters.value);
        store.setPage(page.value);
        return organizations as Organization[];
      } catch (error) {
        showToastError((error as AppError).message);
        throw error;
      }
    },
    {
      watch: [filters, page],
      immediate: true,
      getCachedData: (key, nuxtApp) => {
        if (
          store.getOrganizations().length > 0 &&
          JSON.stringify(store.getFilters()) ===
            JSON.stringify(orgFilters.value) &&
          page.value === store.getPage()
        ) {
          return store.getOrganizations();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      },
      default: () => [],
    }
  );

  const getMore = () => {
    if (isLastPageRef.value) return;
    page.value += 1;
  };

  return {
    data,
    pending,
    error,
    refresh,
    filters: orgFilters.value,
    getMore,
  };
}

// SPDX-License-Identifier: AGPL-3.0-or-later
export const getKeyForGetOrganizations = (filters: OrganizationFilters) =>
  `organizations-list:${JSON.stringify(filters)}`;

export function useGetOrganizations(
  filters: Ref<OrganizationFilters> | ComputedRef<OrganizationFilters>
) {
  const store = useOrganizationStore();
  const page = ref(1);
  const { showToastError } = useToaster();
  const orgFilters = computed(() => unref({ ...filters }));
  // Use AsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<Organization[]>(
    () => getKeyForGetOrganizations(orgFilters.value),
    async () => {
      try {
        //const organizations = await listOrganizations(orgFilters.value);
        const organizations = await listOrganizations({
          ...orgFilters.value,
          page: page.value,
          page_size: 10,
        });
        const organizationsCached = store.getOrganizations();
        const pageCached = store.getPage();
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

  const getMore = async () => {
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

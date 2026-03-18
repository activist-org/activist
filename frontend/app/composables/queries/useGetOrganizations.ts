// SPDX-License-Identifier: AGPL-3.0-or-later

export const getKeyForGetOrganizations = () => `organizations-list`;

export function useGetOrganizations(
  filters: MaybeRef<OrganizationFilters> | ComputedRef<OrganizationFilters>
) {
  const store = useOrganizationListStore();
  const page = ref(1);
  const { showToastError } = useToaster();
  const orgFilters = computed(() => unref(filters));
  // Use AsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<Organization[]>(
    () => getKeyForGetOrganizations(),
    async () => {
      try {
        if (
          store.getItems().length > 0 &&
          JSON.stringify(store.getFilters()) ===
            JSON.stringify(orgFilters.value) &&
          store.getIsLastPage()
        ) {
          return store.getItems();
        }
        const { data: organizations, isLastPage } = await listOrganizations({
          ...orgFilters.value,
          page:
            JSON.stringify(store.getFilters()) ===
            JSON.stringify(orgFilters.value)
              ? page.value
              : 1,
          page_size: 10,
        });
        const organizationsCached = store.getItems();
        const pageCached = store.getPage();
        store.setIsLastPage(isLastPage);

        // Append new events to cached events if page > 1.
        if (
          organizationsCached.length > 0 &&
          JSON.stringify(store.getFilters()) ===
            JSON.stringify(orgFilters.value) &&
          page.value > pageCached
        ) {
          store.setItems([...organizationsCached, ...organizations]);
          return [...organizationsCached, ...organizations] as Organization[];
        }

        store.setItems(organizations);
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
          store.getItems().length > 0 &&
          JSON.stringify(store.getFilters()) ===
            JSON.stringify(orgFilters.value) &&
          page.value === store.getPage()
        ) {
          return store.getItems();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      },
      default: () => [],
    }
  );

  const getMore = () => {
    if (store.getIsLastPage()) return;
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

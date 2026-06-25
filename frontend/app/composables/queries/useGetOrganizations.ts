// SPDX-License-Identifier: AGPL-3.0-or-later

export const getKeyForGetOrganizations = () => `organizations-list`;

export function useGetOrganizations(
  filters: MaybeRef<OrganizationFilters> | ComputedRef<OrganizationFilters>
) {
  const store = useOrganizationListStore();
  const page = ref(1);
  const { handleError } = useAppError();
  const orgFilters = computed(() => unref(filters));
  watch(
    orgFilters,
    (newFilters, oldFilters) => {
      if (JSON.stringify(newFilters) !== JSON.stringify(oldFilters)) {
        page.value = 1;
      }
    },
    { deep: true }
  );
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
        // SSR hydration skipped this factory; seed the store so page 2 appends correctly.
        if (page.value > 1 && store.getItems().length === 0) {
          const nuxtApp = useNuxtApp();
          const ssrItems = nuxtApp.payload.data?.[
            getKeyForGetOrganizations()
          ] as Organization[] | undefined;
          if (ssrItems?.length) {
            store.setItems(ssrItems);
            store.setPage(1);
            store.setFilters(orgFilters.value);
            store.setIsLastPage(false);
          }
        }
        const isFilterChanged =
          JSON.stringify(store.getFilters()) !==
          JSON.stringify(orgFilters.value);

        const { data: organizations, isLastPage } = await listOrganizations({
          ...orgFilters.value,
          page: isFilterChanged ? 1 : page.value,
          page_size: 10,
        });
        const organizationsCached = store.getItems();
        const pageCached = store.getPage();
        store.setIsLastPage(isLastPage);

        // Append new organizations to cached organizations if page > 1.
        if (
          !isFilterChanged &&
          organizationsCached.length > 0 &&
          page.value > pageCached
        ) {
          store.setItems([...organizationsCached, ...organizations]);
          store.setPage(page.value);
          return [...organizationsCached, ...organizations] as Organization[];
        }

        store.setItems(organizations);
        store.setPage(isFilterChanged ? 1 : page.value);
        store.setFilters(orgFilters.value);
        return organizations as Organization[];
      } catch (error) {
        handleError(error);
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
        // Skip SSR payload post-hydration so the factory runs and populates the store.
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

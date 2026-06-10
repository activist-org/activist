// SPDX-License-Identifier: AGPL-3.0-or-later

export const getKeyForGetOrganizations = () => `organizations-list`;

export function useGetOrganizations(
  filters: MaybeRef<OrganizationFilters> | ComputedRef<OrganizationFilters>
) {
  const store = useOrganizationListStore();
  const page = ref(1);
  const { handleError } = useAppError();
  const orgFilters = computed(() => unref(filters));
  // Incremented at the start of every handler invocation; used to discard
  // stale responses that resolve after a newer fetch has already started
  // (e.g. a page-2 request that resolves after the user changed filters).
  const fetchGeneration = ref(0);
  // Use AsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<Organization[]>(
    () => getKeyForGetOrganizations(),
    async () => {
      try {
        // Detect filter change and reset page BEFORE the API call so that
        // the outgoing request always uses the correct page number.
        const filtersChanged =
          JSON.stringify(store.getFilters()) !== JSON.stringify(orgFilters.value);
        if (filtersChanged) {
          page.value = 1;
          store.setPage(1);
        }

        // Stamp this invocation; any concurrent in-flight request that
        // resolves with an older generation will be discarded below.
        const currentGeneration = ++fetchGeneration.value;

        if (
          store.getItems().length > 0 &&
          !filtersChanged &&
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

        const { data: organizations, isLastPage } = await listOrganizations({
          ...orgFilters.value,
          page: page.value,
          page_size: 10,
        });

        // Discard this response if a newer fetch has already started.
        // This prevents stale page-N data from being appended after a filter
        // change races with an in-flight request.
        if (currentGeneration !== fetchGeneration.value) {
          return store.getItems();
        }

        const organizationsCached = store.getItems();
        const pageCached = store.getPage();
        store.setIsLastPage(isLastPage);

        // Append new organizations to cached organizations if page > 1 and filters match.
        if (
          organizationsCached.length > 0 &&
          !filtersChanged &&
          (page.value > pageCached || (page.value === 1 && pageCached === 1))
        ) {
          store.setItems([...organizationsCached, ...organizations]);
          return [...organizationsCached, ...organizations] as Organization[];
        }

        store.setItems(organizations);
        store.setPage(page.value);
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

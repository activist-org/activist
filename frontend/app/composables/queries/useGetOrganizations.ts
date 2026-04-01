// SPDX-License-Identifier: AGPL-3.0-or-later

export const getKeyForGetOrganizations = () => `organizations-list`;

/**
 * Composable for fetching and managing the list of organizations in the frontend application.
 * This composable uses the useAsyncData hook to fetch the list of organizations from the server, handle loading and error states, and cache the data for efficient retrieval.
 * The fetched organizations are stored in a Vuex store using the useOrganizationListStore composable, allowing other components to access and reactively update based on the list of organizations.
 * The composable also integrates error handling using the useAppError composable to manage any errors that occur during the data fetching process.
 * Additionally, it provides a getMore function to fetch additional pages of organizations when needed, and it manages pagination state within the store to ensure proper handling of paginated data.
 * @param filters A reactive reference or computed reference containing the filters to be applied when fetching the list of organizations, allowing the composable to reactively update the fetched data based on changes to the filters.
 * @returns An object containing the data (list of organizations),
 * pending state,
 * error state,
 * a refresh function for managing the fetching and state of organizations in the application,
 * the current filters applied,
 * and a getMore function for fetching additional pages of organizations.
 */
export function useGetOrganizations(
  filters: MaybeRef<OrganizationFilters> | ComputedRef<OrganizationFilters>
) {
  const store = useOrganizationListStore();
  const page = ref(1);
  const { handleError } = useAppError();
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
          (page.value > pageCached || (page.value === 1 && pageCached === 1))
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

// SPDX-License-Identifier: AGPL-3.0-or-later
export const getKeyForGetOrganizations = (filters: OrganizationFilters) =>
  `organizations-list:${JSON.stringify(filters)}`;

export function useGetOrganizations(
  filters: Ref<OrganizationFilters> | ComputedRef<OrganizationFilters>
) {
  const store = useOrganizationStore();
  const { showToastError } = useToaster();
  const orgFilters = computed(() => unref(filters));
  // Use AsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<Organization[]>(
    () => getKeyForGetOrganizations(orgFilters.value),
    async () => {
      try {
        const organizations = await listOrganizations(orgFilters.value);
        store.setOrganizations(organizations);
        store.setFilters(orgFilters.value);
        return organizations as Organization[];
      } catch (error) {
        showToastError((error as AppError).message);
        throw error;
      }
    },
    {
      watch: [orgFilters.value],
      immediate: true,
      getCachedData: (key, nuxtApp) => {
        if (
          store.getOrganizations().length > 0 &&
          JSON.stringify(store.getFilters()) ===
            JSON.stringify(orgFilters.value)
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

  return {
    data,
    pending,
    error,
    refresh,
    filters: orgFilters.value,
  };
}

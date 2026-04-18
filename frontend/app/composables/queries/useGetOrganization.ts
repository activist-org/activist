// SPDX-License-Identifier: AGPL-3.0-or-later

export const getKeyForGetOrganization = (id: string) => `organization:${id}`;

/**
 * Composable for fetching and managing the data of a specific organization in the frontend application. This composable uses the useAsyncData hook to fetch the organization's data from the server based on the provided organization ID, handle loading and error states, and cache the data for efficient retrieval. The fetched organization data is stored in a Vuex store using the useOrganizationStore composable, allowing other components to access and reactively update based on the organization's data. The composable also integrates error handling using the useAppError composable to manage any errors that occur during the data fetching process. Additionally, it provides a refresh function to manually trigger a re-fetch of the organization's data when needed.
 * @param id A reactive reference containing the ID of the organization to be fetched, allowing the composable to reactively update the fetched data based on changes to the organization ID.
 * @returns An object containing the data (organization), pending state, error state, and a refresh function for managing the fetching and state of an organization in the application.
 */
export function useGetOrganization(id: MaybeRef<string>) {
  const { handleError } = useAppError();
  const organizationId = computed(() => String(unref(id)));
  const store = useOrganizationStore();
  const imageStore = useOrganizationImageStore();

  // Cache key for useAsyncData.
  const key = computed(() =>
    organizationId.value ? getKeyForGetOrganization(organizationId.value) : null
  );

  const query = useAsyncData(
    getKeyForGetOrganization(organizationId.value),
    async () => {
      if (!organizationId.value || organizationId.value === "") return null;

      try {
        const organization = await getOrganization(organizationId.value);
        // Cache the result in store.
        store.setOrganization(organization);
        imageStore.setEntityId(organization?.id);
        return organization;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    {
      watch: [organizationId],
      immediate: true,
      dedupe: "defer",
      getCachedData: (key, nuxtApp) => {
        if (
          nuxtApp.isHydrating &&
          store.getOrganization() &&
          store.getOrganization().id !== "" &&
          store.getOrganization().id === organizationId.value
        ) {
          return store.getOrganization();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      },
    }
  );

  // Return cached data if available, otherwise data from useAsyncData.
  const data = computed<Organization | null>(
    () => query.data.value as Organization | null
  );

  // Only show pending when we're actually fetching (not when using cache).
  const pending = computed(() => query.pending.value);

  /**
   * Refreshes the organization's data by triggering a re-fetch from the server.
   * This function clears the cached data and updates the store with the latest organization data.
   */
  async function refresh() {
    if (!key.value) return;
    // Let useAsyncData refetch and update store in the success path above.
    await refreshNuxtData(key.value);
  }

  return {
    data,
    pending,
    error: query.error,
    refresh,
  };
}

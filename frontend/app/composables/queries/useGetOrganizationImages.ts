// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a single images organization with useAsyncData. Store-first, then fetch if missing.
// After fetch, cache it via store. You can always call refresh() to force refetch.

export const getKeyForGetOrganizationImages = (id: string) =>
  `organizationImages:${id}`;

/**
 * Composable for fetching and managing the images associated with an organization in the frontend application.
 * This composable uses the useAsyncData hook to fetch the organization's images from the server, handle loading and error states, and cache the data for efficient retrieval.
 * The fetched images are stored in a Vuex store using the useOrganizationImageStore composable, allowing other components to access and reactively update based on the organization's images.
 * The composable also integrates error handling using the useAppError composable to manage any errors that occur during the data fetching process.
 * The returned object includes the data (list of images), pending state, error state, and a refresh function to manually trigger a re-fetch of the organization's images.
 * @param id A reactive reference containing the ID of the organization for which to fetch the images, allowing the composable to reactively update the fetched data based on changes to the organization ID.
 * @returns An object containing the data (list of images), pending state, error state, and a refresh function for managing the fetching and state of an organization's images in the application.
 */
export function useGetOrganizationImages(id: MaybeRef<string>) {
  const { handleError } = useAppError();
  const organizationId = computed(() => String(unref(id)));
  const store = useOrganizationImageStore();

  // Cache key for useAsyncData.
  const cached = computed(
    () =>
      store.getImages().length > 0 &&
      organizationId.value === store.getEntityId()
  );
  const key = computed(() =>
    organizationId.value
      ? getKeyForGetOrganizationImages(organizationId.value)
      : null
  );

  // Only fetch if we have an ID and no cached data.
  const shouldFetch = computed(() => !!organizationId.value && !cached.value);

  const query = useAsyncData(
    getKeyForGetOrganizationImages(organizationId.value),
    async () => {
      if (!organizationId.value) {
        return null;
      }

      try {
        const images = await fetchOrganizationImages(organizationId.value);

        // Cache the result in store.
        store.setImages(images);

        return images;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    {
      watch: [organizationId],
      dedupe: "defer",
      getCachedData: (key, nuxtApp) => {
        if (
          nuxtApp.isHydrating &&
          store.getImages().length > 0 &&
          organizationId.value === store.getEntityId()
        ) {
          return store.getImages();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      },
    }
  );

  // Return cached data if available, otherwise data from useAsyncData.
  const data = computed<ContentImage[]>(
    () => (query.data.value as ContentImage[]) || []
  );
  // Only show pending when we're actually fetching (not when using cache).
  const pending = computed(() =>
    shouldFetch.value ? query.pending.value : false
  );

  /**
   *
   */
  async function refresh() {
    if (!key.value) {
      return;
    }
    // Clear cache first to force refetch.
    if (organizationId.value) {
      store.clearImages();
    }
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

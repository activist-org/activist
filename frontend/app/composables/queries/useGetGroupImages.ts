// SPDX-License-Identifier: AGPL-3.0-or-later
export const getKeyForGetGroupImages = (id: string) => `groupImages:${id}`;

/**
 * Composable for fetching and managing the images associated with a group in the frontend application. This composable uses the useAsyncData hook to fetch the group's images from the server, handle loading and error states, and cache the data for efficient retrieval. The fetched images are stored in a Vuex store using the useGroupImageStore composable, allowing other components to access and reactively update based on the group's images. The composable also integrates error handling using the useAppError composable to manage any errors that occur during the data fetching process. The returned object includes the data (list of images), pending state, error state, and a refresh function to manually trigger a re-fetch of the group's images.
 * @param id A reactive reference containing the ID of the group for which to fetch the images, allowing the composable to reactively update the fetched data based on changes to the group ID.
 * @returns An object containing the data (list of images), pending state, error state, and a refresh function for managing the fetching and state of a group's images in the application.
 */
export function useGetGroupImages(id: MaybeRef<string>) {
  const { handleError } = useAppError();
  const groupId = computed(() => unref(id));
  const store = useGroupImageStore();
  // Cache key for useAsyncData.
  const key = computed(() =>
    groupId.value ? getKeyForGetGroupImages(groupId.value) : null
  );

  // Check if we have cached data.
  const cached = computed(
    () => store.getImages().length > 0 && groupId.value === store.getEntityId()
  );

  // Only fetch if we have an ID and no cached data.
  const shouldFetch = computed(() => !!groupId.value && !cached.value);
  const query = useAsyncData(
    getKeyForGetGroupImages(groupId.value),
    async () => {
      if (!groupId.value) {
        return null;
      }

      try {
        const images = await fetchGroupImages(groupId.value);
        // Cache the result in store.
        store.setImages(images);
        return images;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    {
      watch: [groupId],
      dedupe: "defer",
      getCachedData: (key, nuxtApp) => {
        if (
          nuxtApp.isHydrating &&
          store.getImages().length > 0 &&
          groupId.value === store.getEntityId()
        ) {
          return store.getImages();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      },
      // Don't execute on server if we already have cached data.
      server: shouldFetch.value,
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
   * Refreshes the group's images by triggering a re-fetch from the server.
   * This function clears the cached data and updates the store with the latest images
   */
  async function refresh() {
    if (!key.value) {
      return;
    }
    // Clear cache first to force refetch.
    if (groupId.value === store.getEntityId()) {
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

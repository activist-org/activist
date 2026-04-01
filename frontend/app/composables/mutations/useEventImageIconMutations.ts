// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

/**
 * Composable for managing mutations related to event icon images in the frontend application. This composable provides functions to upload new icon images for an event, as well as a function to refresh the event data after mutations. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The composable ensures that after any mutation, the event's data is refreshed by invalidating the cache, allowing subsequent reads to fetch the updated data from the server.
 * @param eventId A reactive reference containing the ID of the event for which the icon images are being managed, allowing the composable to reactively update its behavior based on changes to the event ID.
 * @returns An object containing the loading state, error state, functions for uploading icon images, and a function for refreshing the event's data after mutations.
 */
export function useEventImageIconMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const currentEventId = computed(() => unref(eventId));
  const store = useEventListStore();

  /**
   * Uploads a new icon image for the current event based on the provided image file.
   * @param image An object representing the image file to be uploaded.
   * @returns A boolean value indicating the success of the upload operation, where true represents a successful upload and false indicates a failure due to an error during the mutation process.
   */
  async function uploadIconImage(image: UploadableFile) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await uploadEventIconImage(currentEventId.value, image);

      // Invalidate cache and refetch fresh data.
      await refreshEventData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Refreshes the event data by invalidating the cache and refetching fresh data.
   */
  async function refreshEventData() {
    if (!currentEventId.value) return;

    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(getKeyForGetEvent(currentEventId.value));
    // Clear cached events to force refetch with new data.
    store.setItems([]);
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    uploadIconImage,
    refreshEventData,
  };
}

// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

/**
 * Composable for managing mutations related to event texts in the frontend application. This composable provides a function to update event texts based on the provided text data and text ID. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The composable ensures that after updating the event texts, the event's data is refreshed by invalidating the cache, allowing subsequent reads to fetch the updated data from the server.
 * @param eventId A reactive reference containing the ID of the event for which the texts are being managed, allowing the composable to reactively update its behavior based on changes to the event ID.
 * @returns An object containing the loading state, error state, updateTexts function for updating event texts, and refreshEventData function for refreshing the event's data after mutations.
 */
export function useEventTextsMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const currentEventId = computed(() => unref(eventId));

  /**
   * Updates the texts for the current event based on the provided form data and text ID.
   * @param textsData The form data containing the updated texts for the event.
   * @param textId The ID of the text entry to be updated.
   * @returns A boolean value indicating the success of the update operation, where true represents a successful update and false indicates a failure due to an error during the mutation process.
   */
  async function updateTexts(
    textsData: EventUpdateTextFormData,
    textId: string
  ) {
    if (!currentEventId.value) return false;

    loading.value = true;
    clearError();
    try {
      // Service function handles the HTTP call and throws normalized errors.
      await updateEventTexts(currentEventId.value, textId, textsData);

      // Refresh the event data to get the updated texts.
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
   * Refreshes the event data by invalidating the useAsyncData cache for the current event. This function ensures that the latest data is fetched after any mutations, such as updating event texts.
   */
  async function refreshEventData() {
    if (!currentEventId.value) return;

    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(getKeyForGetEvent(currentEventId.value));
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateTexts,
    refreshEventData,
  };
}

// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

/**
 * Composable for managing mutations related to event FAQ entries in the frontend application. This composable provides functions to create, update, reorder, and delete FAQ entries for an event, as well as a function to refresh the event data after mutations. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The composable ensures that after any mutation, the event's data is refreshed by invalidating the cache, allowing subsequent reads to fetch the updated data from the server.
 * @param eventId A reactive reference containing the ID of the event for which the FAQ entries are being managed, allowing the composable to reactively update its behavior based on changes to the event ID.
 * @returns An object containing the loading state, error state, functions for creating, updating, reordering, and deleting FAQ entries, and a function for refreshing the event's data after mutations.
 */
export function useEventFAQEntryMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const currentEventId = computed(() => unref(eventId));

  /**
   * Creates a new FAQ entry for the current event based on the provided data.
   * @param faqData An object containing the data for the new FAQ entry, excluding the ID.
   * @returns A boolean value indicating the success of the creation operation, where true represents a successful creation and false indicates a failure due to an error during the mutation process.
   */
  async function createFAQ(faqData: Omit<FaqEntry, "id">) {
    if (!currentEventId.value) return false;

    loading.value = true;
    clearError();

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createEventFaq(currentEventId.value, faqData as FaqEntry);

      // Refresh the event data to get the new FAQ.
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
   * Updates an existing FAQ entry for the current event based on the provided data.
   * @param faq An object containing the data for the FAQ entry to be updated, including the ID.
   * @returns A boolean value indicating the success of the update operation, where true represents a successful update and false indicates a failure due to an error during the mutation process.
   */
  async function updateFAQ(faq: FaqEntry) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await updateEventFaq(currentEventId.value, faq);

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
   * Reorders multiple FAQ entries for the current event based on the provided array of FAQ entries.
   * @param faqs An array of FAQ entries representing the new order.
   * @returns A boolean value indicating the success of the reorder operation, where true represents a successful reorder and false indicates a failure due to an error during the mutation process.
   */
  async function reorderFAQs(faqs: FaqEntry[]) {
    loading.value = true;
    clearError();

    try {
      await reorderEventFaqs(currentEventId.value, faqs);

      // Refresh to get the updated order.
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
   * Deletes an existing FAQ entry for the current event based on the provided ID.
   * @param faqId The ID of the FAQ entry to be deleted.
   * @returns A boolean value indicating the success of the deletion operation, where true represents a successful deletion and false indicates a failure due to an error during the mutation process.
   */
  async function deleteFAQ(faqId: string) {
    loading.value = true;
    clearError();

    try {
      await deleteEventFaq(faqId);

      // Refresh to get the updated list.
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
  }

  return {
    loading: readonly(loading),
    error,
    createFAQ,
    updateFAQ,
    reorderFAQs,
    deleteFAQ,
    refreshEventData,
  };
}

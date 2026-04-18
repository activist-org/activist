// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

/**
 * Composable for managing mutations related to group FAQ entries in the frontend application. This composable provides functions to create, update, reorder, and delete FAQ entries for a group, as well as a function to refresh the group data after mutations. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The composable ensures that after any mutation, the group's data is refreshed by invalidating the cache, allowing subsequent reads to fetch the updated data from the server.
 * @param groupId A reactive reference containing the ID of the group for which the FAQ entries are being managed, allowing the composable to reactively update its behavior based on changes to the group ID.
 * @returns An object containing the loading state, error state, functions for creating, updating, reordering, and deleting FAQ entries, and a function for refreshing the group's data after mutations.
 */
export function useGroupFAQEntryMutations(groupId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));

  /**
   * Creates a new FAQ entry for the group based on the provided FAQ data. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the group data after a successful creation.
   * @param faqData An object containing the new FAQ entry information. The function uses this data to perform the creation operation and ensures that the group's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the creation operation, where true represents a successful creation and false indicates a failure due to an error during the mutation process.
   */
  async function createFAQ(faqData: Omit<FaqEntry, "id">) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createGroupFaq(currentGroupId.value, faqData as FaqEntry);

      // Refresh the group data to get the new FAQ.
      await refreshGroupData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Update existing FAQ entry.
  /**
   * Updates an existing FAQ entry for the group based on the provided FAQ data. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the group data after a successful update.
   * @param faq An object containing the updated FAQ entry information. The function uses this data to perform the update operation and ensures that the group's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the update operation, where true represents a successful update and false indicates a failure due to an error during the mutation process.
   */
  async function updateFAQ(faq: FaqEntry) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await updateGroupFaq(faq);

      // Invalidate cache and refetch fresh data.
      await refreshGroupData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Reorders FAQ entries for the group based on the provided array of FAQ entries. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the group data after a successful reorder.
   * @param faqs An array of FAQ entry objects containing the updated order information for each FAQ entry. The function uses this data to perform the reorder operation and ensures that the group's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the reorder operation, where true represents a successful reorder and false indicates a failure due to an error during the mutation process.
   */
  async function reorderFAQs(faqs: FaqEntry[]) {
    loading.value = true;
    clearError();

    try {
      await reorderGroupFaqs(faqs);

      // Refresh to get the updated order.
      await refreshGroupData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Deletes an existing FAQ entry for the group based on the provided FAQ ID. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the group data after a successful deletion. It allows for deleting an existing FAQ entry by accepting the FAQ ID and ensures that the group's data is updated to reflect the removal of the FAQ entry.
   * @param faqId The ID of the FAQ entry to be deleted. The function uses this ID to perform the deletion operation and ensures that the group's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the deletion operation, where true represents a successful deletion and false indicates a failure due to an error during the mutation process.
   */
  async function deleteFAQ(faqId: string) {
    loading.value = true;
    clearError();

    try {
      await deleteGroupFaq(faqId);

      // Refresh to get the updated list.
      await refreshGroupData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Refreshes the group data by invalidating the useAsyncData cache for the current group. This function ensures that the latest data is fetched after any mutations, such as creating, updating, reordering, or deleting FAQ entries.
   */
  async function refreshGroupData() {
    if (!currentGroupId.value) {
      return;
    }

    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(getKeyForGetGroup(currentGroupId.value));
  }

  return {
    loading: readonly(loading),
    error: error,
    createFAQ,
    updateFAQ,
    reorderFAQs,
    deleteFAQ,
    refreshGroupData,
  };
}

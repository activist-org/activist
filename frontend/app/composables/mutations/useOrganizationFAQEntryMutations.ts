// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Composable for managing mutations related to organization FAQ entries in the frontend application. This composable provides functions to create, update, delete, and reorder organization FAQ entries, as well as refresh the organization data after mutations. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The composable ensures that after any mutation, the organization's data is refreshed by invalidating the cache, allowing subsequent reads to fetch the updated data from the server.
 * @param organizationId A reactive reference containing the ID of the organization for which the FAQ entries are being managed, allowing the composable to reactively update its behavior based on changes to the organization ID.
 * @returns An object containing the loading state, error state, functions for creating, updating, deleting, and reordering FAQ entries, and a function for refreshing the organization's data after mutations.
 */
export function useOrganizationFAQEntryMutations(
  organizationId: MaybeRef<string>
) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();
  const currentOrganizationId = computed(() => unref(organizationId));

  /**
   * Creates a new FAQ entry for the organization based on the provided FAQ data. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful creation. It allows for creating a new FAQ entry by accepting an object containing the FAQ information, such as the question, answer, and order, and ensures that the organization's data is updated to reflect the newly created FAQ entry.
   * @param faqData An object containing the new FAQ entry information, such as the question, answer, and order. The function uses this data to perform the creation operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the creation operation, where true represents a successful creation and false indicates a failure due to an error during the mutation process.
   */
  async function createFAQ(faqData: Omit<FaqEntry, "id">) {
    if (!currentOrganizationId.value) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createOrganizationFaq(
        currentOrganizationId.value,
        faqData as FaqEntry
      );

      // Refresh the organization data to get the new FAQ.
      await refreshOrganizationData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Updates an existing FAQ entry for the organization based on the provided FAQ data. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful update. It allows for updating an existing FAQ entry by accepting an object containing the FAQ information, such as the question, answer, and order, and ensures that the organization's data is updated to reflect the changes.
   * @param faq An object containing the updated FAQ entry information, such as the question, answer, and order. The function uses this data to perform the update operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the update operation, where true represents a successful update and false indicates a failure due to an error during the mutation process.
   */
  async function updateFAQ(faq: FaqEntry) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await updateOrganizationFaq(faq);

      // Invalidate cache and refetch fresh data.
      await refreshOrganizationData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Reorders the FAQ entries for the organization based on the provided array of FAQ entries. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful reorder. It allows for reordering FAQ entries by accepting an array of FAQ entry objects, each containing the updated order information, and ensures that the organization's data is updated to reflect the new order of FAQ entries.
   * @param faqs An array of FAQ entry objects containing the updated order information for each FAQ entry. The function uses this data to perform the reorder operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the reorder operation, where true represents a successful reorder and false indicates a failure due to an error during the mutation process.
   */
  async function reorderFAQs(faqs: FaqEntry[]) {
    loading.value = true;
    clearError();

    try {
      await reorderOrganizationFaqs(faqs);

      // Refresh to get the updated order.
      await refreshOrganizationData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Delete FAQ entry.
  /**
   * Deletes an existing FAQ entry for the organization based on the provided FAQ ID. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful deletion. It allows for deleting an existing FAQ entry by accepting the FAQ ID and ensures that the organization's data is updated to reflect the removal of the FAQ entry.
   * @param faqId The ID of the FAQ entry to be deleted. The function uses this ID to perform the deletion operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the deletion operation, where true represents a successful deletion and false indicates a failure due to an error during the mutation process.
   */
  async function deleteFAQ(faqId: string) {
    loading.value = true;
    clearError();

    try {
      await deleteOrganizationFaq(faqId);

      // Refresh to get the updated list.
      await refreshOrganizationData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Refreshes the organization data by invalidating the useAsyncData cache for the current organization. This function ensures that the latest data is fetched after any mutations, such as creating, updating, reordering, or deleting FAQ entries.
   */
  async function refreshOrganizationData() {
    if (!currentOrganizationId.value) {
      return;
    }

    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(
      getKeyForGetOrganization(currentOrganizationId.value)
    );
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    createFAQ,
    updateFAQ,
    reorderFAQs,
    deleteFAQ,
    refreshOrganizationData,
  };
}

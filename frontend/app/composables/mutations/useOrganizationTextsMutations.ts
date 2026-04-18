// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Composable for managing mutations related to organization texts in the frontend application. This composable provides functions to update organization texts and refresh the organization data after mutations. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The updateTexts function allows updating specific organization texts based on the provided text ID and form data, while the refreshOrganizationData function invalidates the cache for the organization's data to ensure that subsequent reads will fetch the updated data from the server.
 * @param organizationId A reactive reference containing the ID of the organization for which the texts are being managed, allowing the composable to reactively update its behavior based on changes to the organization ID.
 * @returns An object containing the loading state, error state, updateTexts function for updating organization texts, and refreshOrganizationData function for refreshing the organization's data after mutations.
 */
export function useOrganizationTextsMutations(
  organizationId: MaybeRef<string>
) {
  const { handleError, error, clearError } = useAppError();

  const loading = ref(false);

  const currentOrganizationId = computed(() => unref(organizationId));

  /**
   * Updates the texts for the current organization based on the provided form data and text ID.
   * @param textsData The form data containing the updated texts for the organization.
   * @param textId The ID of the text entry to be updated.
   * @returns A boolean value indicating the success of the update operation, where true represents a successful update and false indicates a failure due to an error during the mutation process.
   */
  async function updateTexts(
    textsData: OrganizationUpdateTextFormData,
    textId: string
  ) {
    if (!currentOrganizationId.value) {
      return false;
    }
    clearError();
    loading.value = true;
    try {
      // Service function handles the HTTP call and throws normalized errors.
      await updateOrganizationTexts(
        currentOrganizationId.value,
        textId,
        textsData
      );
      // Refresh the organization data to get the updated texts.
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
   * Refreshes the organization data by invalidating the cache.
   * This function ensures that subsequent reads will fetch the updated data from the server.
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
    updateTexts,
    refreshOrganizationData,
  };
}

// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Composable for managing mutations related to group texts in the frontend application. This composable provides functions to update group texts and refresh the group data after mutations. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The updateTexts function allows updating specific group texts based on the provided text ID and form data, while the refreshGroupData function invalidates the cache for the group's data to ensure that subsequent reads will fetch the updated data from the server.
 * @param groupId A reactive reference containing the ID of the group for which the texts are being managed, allowing the composable to reactively update its behavior based on changes to the group ID.
 * @returns An object containing the loading state, error state, updateTexts function for updating group texts, and refreshGroupData function for refreshing the group's data after mutations.
 */
export function useGroupTextsMutations(groupId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));

  /**
   * Updates the texts for the current group based on the provided form data and text ID.
   * @param textsData The form data containing the updated texts for the group.
   * @param textId The ID of the text entry to be updated.
   * @returns A boolean value indicating the success of the update operation, where true represents a successful update and false indicates a failure due to an error during the mutation process.
   */
  async function updateTexts(
    textsData: GroupUpdateTextFormData,
    textId: string
  ) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    clearError();
    try {
      // Service function handles the HTTP call and throws normalized errors.
      await updateGroupTexts(currentGroupId.value, textId, textsData);
      // Refresh the group data to get the updated texts.
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
   * Refreshes the group data by invalidating the useAsyncData cache for the current group. This function ensures that the latest data is fetched after any mutations, such as updating group texts.
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
    error,
    updateTexts,
    refreshGroupData,
  };
}

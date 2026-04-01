// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Composable for managing mutations related to group social links in the frontend application. This composable provides functions to update, create, delete, and replace social links for a group, as well as a function to refresh the group data after mutations. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The composable ensures that after any mutation, the group's data is refreshed by invalidating the cache, allowing subsequent reads to fetch the updated data from the server.
 * @param groupId A reactive reference containing the ID of the group for which the social links are being managed, allowing the composable to reactively update its behavior based on changes to the group ID.
 * @returns An object containing the loading state, error state, functions for updating, creating, deleting, and replacing social links, and a function for refreshing the group's data after mutations.
 */
export function useGroupSocialLinksMutations(groupId: MaybeRef<string>) {
  const { error, handleError, clearError } = useAppError();

  const loading = ref(false);

  const currentGroupId = computed(() => unref(groupId));

  /**
   * Updates a single social link for the current group based on the provided link ID and data. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the group data after a successful update.
   * @param linkId The ID of the social link to be updated. The function uses this ID to perform the update operation and ensures that the group's data is refreshed afterward to reflect the changes.
   * @param data An object containing the updated link information, including the link URL, label, and order. The function uses this data to perform the update operation and ensures that the group's data is refreshed afterward to reflect the changes.
   * @param data.link The URL of the social link to be updated.
   * @param data.label The label for the social link to be updated.
   * @param data.order The order of the social link to be updated, which determines its position in the list of social links for the group.
   * @returns A boolean value indicating the success of the update operation, where true represents a successful update and false indicates a failure due to an error during the mutation process.
   */
  async function updateLink(
    linkId: string,
    data: { link: string; label: string; order: number }
  ) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      await updateGroupSocialLink(linkId, {
        ...data,
        group: currentGroupId.value,
      });

      // Refresh the group data to get updated links.
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
   * Creates new social links for the group based on the provided array of link information. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the group data after a successful creation. It allows for creating multiple social links at once by accepting an array of link data objects, each containing the link URL, label, and order.
   * @param links An array of objects containing the new social link information, including the link URL, label, and order. The function uses this data to perform the creation operation and ensures that the group's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the creation operation, where true represents a successful creation and false indicates a failure due to an error during the mutation process.
   */
  async function createLinks(links: SocialLinkInput[]) {
    if (!currentGroupId.value || !links.length) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      await createGroupSocialLinks(currentGroupId.value, links);

      // Refresh the group data to get updated links.
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
   * Deletes a social link for the group based on the provided link ID. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the group data after a successful deletion.
   * @param linkId The ID of the social link to be deleted.
   * @returns A boolean value indicating the success of the deletion operation, where true represents a successful deletion and false indicates a failure due to an error during the mutation process.
   */
  async function deleteLink(linkId: string) {
    loading.value = true;
    clearError();

    try {
      await deleteGroupSocialLink(linkId);

      // Refresh the group data to get updated links.
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
   * Replaces all social links for the group with the provided array of link information. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the group data after a successful replacement. It allows for replacing all social links at once by accepting an array of link data objects, each containing the link URL, label, and order.
   * @param links An array of objects containing the new social link information, including the link URL, label, and order. The function uses this data to perform the replacement operation and ensures that the group's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the replacement operation, where true represents a successful replacement and false indicates a failure due to an error during the mutation process.
   */
  async function replaceAllLinks(
    links: { link: string; label: string; order: number }[]
  ) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      await replaceAllGroupSocialLinks(currentGroupId.value, links);

      // Refresh the group data to get updated links.
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
   * Refreshes the group data by invalidating the useAsyncData cache for the current group. This function ensures that the latest data is fetched after any mutations, such as creating, deleting, or replacing social links.
   */
  async function refreshGroupData() {
    if (!currentGroupId.value) {
      return;
    }

    // Refresh the useAsyncData cache.
    await refreshNuxtData(getKeyForGetGroup(currentGroupId.value));
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateLink,
    createLinks,
    deleteLink,
    replaceAllLinks,
    refreshGroupData,
  };
}

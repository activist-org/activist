// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Composable for managing mutations related to group resources in the frontend application. This composable provides functions to create, update, delete, and reorder resources for a group, as well as a function to refresh the group data after mutations. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The composable ensures that after any mutation, the group's data is refreshed by invalidating the cache, allowing subsequent reads to fetch the updated data from the server.
 * @param groupId A reactive reference containing the ID of the group for which the resources are being managed, allowing the composable to reactively update its behavior based on changes to the group ID.
 * @returns An object containing the loading state, error state, functions for creating, updating, deleting, and reordering resources, and a function for refreshing the group's data after mutations.
 */
export function useGroupResourcesMutations(groupId: MaybeRef<string>) {
  const { error, handleError, clearError } = useAppError();

  const loading = ref(false);

  const currentGroupId = computed(() => unref(groupId));

  /**
   * Creates a new resource for the group based on the provided resource data. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the group data after a successful creation.
   * @param resourceData An object containing the new resource information. The function uses this data to perform the creation operation and ensures that the group's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the creation operation, where true represents a successful creation and false indicates a failure due to an error during the mutation process.
   */
  async function createResource(resourceData: ResourceInput) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createGroupResource(currentGroupId.value, resourceData as Resource);

      // Refresh the group data to get the new resource.
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
   * Updates an existing resource for the group based on the provided resource data. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the group data after a successful update.
   * @param resource An object containing the updated resource information. The function uses this data to perform the update operation and ensures that the group's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the update operation, where true represents a successful update and false indicates a failure due to an error during the mutation process.
   */
  async function updateResource(resource: ResourceInput) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await updateGroupResource(resource);

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
   * Deletes an existing resource for the group based on the provided resource ID. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the group data after a successful deletion.
   * @param resourceId The ID of the resource to be deleted. The function uses this ID to perform the deletion operation and ensures that the group's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the deletion operation, where true represents a successful deletion and false indicates a failure due to an error during the mutation process.
   */
  async function deleteResource(resourceId: string) {
    loading.value = true;
    clearError();

    try {
      await deleteGroupResource(resourceId);

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
   * Reorders multiple resources for the group based on the provided array of resource data. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the group data after a successful reorder.
   * @param resources An array of objects containing the resource information, including the resource ID and the new order. The function uses this data to perform the reorder operation and ensures that the group's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the reorder operation, where true represents a successful reorder and false indicates a failure due to an error during the mutation process.
   */
  async function reorderResources(resources: Resource[]) {
    loading.value = true;
    clearError();

    try {
      await reorderGroupResources(resources);

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
   * Refreshes the group data by invalidating the useAsyncData cache for the current group. This function ensures that the latest data is fetched after any mutations, such as creating, updating, deleting, or reordering resources.
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
    error: readonly(error),
    createResource,
    updateResource,
    deleteResource,
    reorderResources,
    refreshGroupData,
  };
}

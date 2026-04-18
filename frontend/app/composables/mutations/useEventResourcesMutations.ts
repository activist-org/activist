// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Composable for managing mutations related to event resources in the frontend application. This composable provides functions to create, update, delete, and reorder resources for an event, as well as a function to refresh the event data after mutations. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The composable ensures that after any mutation, the event's data is refreshed by invalidating the cache, allowing subsequent reads to fetch the updated data from the server.
 * @param eventId A reactive reference containing the ID of the event for which the resources are being managed, allowing the composable to reactively update its behavior based on changes to the event ID.
 * @returns An object containing the loading state, error state, functions for creating, updating, deleting, and reordering resources, and a function for refreshing the event's data after mutations.
 */
export function useEventResourcesMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const currentEventId = computed(() => unref(eventId));

  /**
   * Creates a new resource for the current event based on the provided resource data.
   * @param resourceData An object containing the information for the resource to be created.
   * @returns A boolean value indicating the success of the creation operation, where true represents a successful creation and false indicates a failure due to an error during the mutation process.
   */
  async function createResource(resourceData: ResourceInput) {
    if (!currentEventId.value) return false;

    loading.value = true;
    clearError();

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createEventResource(currentEventId.value, resourceData as Resource);

      // Refresh the event data to get the new resource.
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
   * Updates an existing resource for the current event based on the provided resource data.
   * @param resource An object containing the updated information for the resource.
   * @returns A boolean value indicating the success of the update operation, where true represents a successful update and false indicates a failure due to an error during the mutation process.
   */
  async function updateResource(resource: ResourceInput) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await updateEventResource(currentEventId.value, resource);

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
   * Deletes an existing resource for the current event based on the provided resource ID.
   * @param resourceId The ID of the resource to be deleted.
   * @returns A boolean value indicating the success of the deletion operation, where true represents a successful deletion and false indicates a failure due to an error during the mutation process.
   */
  async function deleteResource(resourceId: string) {
    loading.value = true;
    clearError();

    try {
      await deleteEventResource(resourceId);

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
   * Reorders the resources for the current event based on the provided array of resources.
   * @param resources An array of resource objects representing the new order of the resources.
   * @returns A boolean value indicating the success of the reorder operation, where true represents a successful reorder and false indicates a failure due to an error during the mutation process.
   */
  async function reorderResources(resources: Resource[]) {
    loading.value = true;
    clearError();
    try {
      await reorderEventResources(currentEventId.value, resources);

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
   * Refreshes the event data by invalidating the useAsyncData cache for the current event. This function ensures that the latest data is fetched after any mutations, such as creating, updating, deleting, or reordering resources.
   */
  async function refreshEventData() {
    if (!currentEventId.value) return;
    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(getKeyForGetEvent(currentEventId.value));
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    createResource,
    updateResource,
    deleteResource,
    reorderResources,
    refreshEventData,
  };
}

// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Composable for managing mutations related to organization resources in the frontend application. This composable provides functions to create, update, delete, and reorder organization resources, as well as refresh the organization data after mutations. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The composable ensures that after any mutation, the organization's data is refreshed by invalidating the cache, allowing subsequent reads to fetch the updated data from the server.
 * @param organizationId A reactive reference containing the ID of the organization for which the resources are being managed, allowing the composable to reactively update its behavior based on changes to the organization ID.
 * @returns An object containing the loading state, error state, functions for creating, updating, deleting, and reordering resources, and a function for refreshing the organization's data after mutations.
 */
export function useOrganizationResourcesMutations(
  organizationId: MaybeRef<string>
) {
  const loading = ref(false);
  const { handleError, error, clearError } = useAppError();

  const currentOrganizationId = computed(() => unref(organizationId));

  /**
   * Creates a new resource for the organization based on the provided resource data. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful creation. It allows for creating a new resource by accepting an object containing the resource information, such as the title, description, link, and order, and ensures that the organization's data is updated to reflect the newly created resource.
   * @param resourceData An object containing the new resource information, such as the title, description, link, and order. The function uses this data to perform the creation operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the creation operation, where true represents a successful creation and false indicates a failure due to an error during the mutation process.
   */
  async function createResource(resourceData: ResourceInput) {
    if (!currentOrganizationId.value) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createOrganizationResource(
        currentOrganizationId.value,
        resourceData as Resource
      );

      // Refresh the organization data to get the new resource.
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
   * Updates an existing resource for the organization based on the provided resource data. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful update. It allows for updating an existing resource by accepting an object containing the resource information, such as the title, description, link, and order, and ensures that the organization's data is updated to reflect the changes.
   * @param resource An object containing the updated resource information, such as the title, description, link, and order. The function uses this data to perform the update operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the update operation, where true represents a successful update and false indicates a failure due to an error during the mutation process.
   */
  async function updateResource(resource: ResourceInput) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await updateOrganizationResource(currentOrganizationId.value, resource);

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
   * Deletes an existing resource for the organization based on the provided resource ID. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful deletion. It allows for deleting an existing resource by accepting the resource ID and ensures that the organization's data is updated to reflect the removal of the resource.
   * @param resourceId The ID of the resource to be deleted. The function uses this ID to perform the deletion operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the deletion operation, where true represents a successful deletion and false indicates a failure due to an error during the mutation process.
   */
  async function deleteResource(resourceId: string) {
    loading.value = true;
    clearError();

    try {
      await deleteOrganizationResource(resourceId);

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
   * Reorders multiple resources for the organization based on the provided array of resources. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful reorder. It allows for updating the order of multiple resources by accepting an array of resource objects and ensures that the organization's data is updated to reflect the new order.
   * @param resources An array of resource objects containing the updated order information. The function uses this data to perform the reorder operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the reorder operation, where true represents a successful reorder and false indicates a failure due to an error during the mutation process.
   */
  async function reorderResources(resources: Resource[]) {
    loading.value = true;
    clearError();

    try {
      await reorderOrganizationResources(
        currentOrganizationId.value,
        resources
      );

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

  /**
   * Refreshes the organization data by invalidating the cache.
   * This function ensures that subsequent reads will fetch the updated data from the server, allowing the frontend application to reflect the changes made to the organization's resources after any mutation operation.
   * By calling this function after mutations, it guarantees that the latest organization data is available for components that rely on it, providing a consistent and up-to-date user experience.
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
    createResource,
    updateResource,
    deleteResource,
    reorderResources,
    refreshOrganizationData,
  };
}

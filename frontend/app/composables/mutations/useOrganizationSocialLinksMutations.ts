// SPDX-License-Identifier: AGPL-3.0-or-later
// Update organization social links with error handling and store updates.

/**
 * Composable for managing mutations related to organization social links in the frontend application. This composable provides functions to update, create, delete, and replace organization social links, as well as refresh the organization data after mutations. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The composable ensures that after any mutation, the organization's data is refreshed by invalidating the cache, allowing subsequent reads to fetch the updated data from the server.
 * @param organizationId A reactive reference containing the ID of the organization for which the social links are being managed, allowing the composable to reactively update its behavior based on changes to the organization ID.
 * @returns An object containing the loading state, error state, functions for updating, creating, deleting, and replacing social links, and a function for refreshing the organization's data after mutations.
 */
export function useOrganizationSocialLinksMutations(
  organizationId: MaybeRef<string>
) {
  const loading = ref(false);
  const { handleError, error, clearError } = useAppError();

  const currentOrganizationId = computed(() => unref(organizationId));

  // Update a single social link.
  /**
   * Updates a specific organization social link based on the provided link ID and form data. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful update.
   * @param linkId The ID of the social link to be updated.
   * @param data An object containing the updated link information, including the link URL, label, and order. The function uses this data to perform the update operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @param data.link The URL of the social link to be updated.
   * @param data.label The label for the social link to be updated.
   * @param data.order The order of the social link to be updated, which determines its position in the list of social links for the organization.
   * @returns A boolean value indicating the success of the update operation, where true represents a successful update and false indicates a failure due to an error during the mutation process.
   */
  async function updateLink(
    linkId: string,
    data: { link: string; label: string; order: number }
  ) {
    if (!currentOrganizationId.value) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      await updateOrganizationSocialLink(currentOrganizationId.value, linkId, {
        ...data,
      });

      // Refresh the organization data to get updated links.
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
   * Creates new social links for the organization based on the provided array of link information. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful creation. It allows for creating multiple social links at once by accepting an array of link data objects, each containing the link URL, label, and order.
   * @param links An array of objects containing the new social link information, including the link URL, label, and order. The function uses this data to perform the creation operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the creation operation, where true represents a successful creation and false indicates a failure due to an error during the mutation process.
   */
  async function createLinks(links: SocialLinkInput[]) {
    if (!currentOrganizationId.value || !links.length) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      await createOrganizationSocialLinks(currentOrganizationId.value, links);

      // Refresh the organization data to get updated links.
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
   * Deletes an existing social link for the organization based on the provided link ID. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful deletion.
   * @param linkId The ID of the social link to be deleted. The function uses this ID to perform the deletion operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the deletion operation, where true represents a successful deletion and false indicates a failure due to an error during the mutation process.
   */
  async function deleteLink(linkId: string) {
    loading.value = true;
    clearError();

    try {
      await deleteOrganizationSocialLink(linkId);

      // Refresh the organization data to get updated links.
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
   * Replaces all existing social links for the organization with a new set of links based on the provided array of link information. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful replacement. It allows for replacing all social links at once by accepting an array of link data objects, each containing the link URL, label, and order, and ensures that the organization's data is updated to reflect the new set of social links.
   * @param links An array of objects containing the new social link information, including the link URL, label, and order. The function uses this data to perform the replacement operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the replacement operation, where true represents a successful replacement and false indicates a failure due to an error during the mutation process.
   */
  async function replaceAllLinks(
    links: { link: string; label: string; order: number }[]
  ) {
    if (!currentOrganizationId.value) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      await replaceAllOrganizationSocialLinks(
        currentOrganizationId.value,
        links
      );

      // Refresh the organization data to get updated links.
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
   * This function ensures that subsequent reads will fetch the updated data from the server,
   * allowing the frontend application to reflect the changes made to the organization's social links after any mutation operation.
   * By calling this function after mutations, it guarantees that the latest organization data is available for components that rely on it, providing a consistent and up-to-date user experience.
   */
  async function refreshOrganizationData() {
    if (!currentOrganizationId.value) {
      return;
    }

    // Refresh the useAsyncData cache.
    await refreshNuxtData(
      getKeyForGetOrganization(currentOrganizationId.value)
    );
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateLink,
    createLinks,
    deleteLink,
    replaceAllLinks,
    refreshOrganizationData,
  };
}

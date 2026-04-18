// SPDX-License-Identifier: AGPL-3.0-or-later
// Update event social links with error handling and store updates.

/**
 * Composable for managing mutations related to event social links in the frontend application. This composable provides functions to update, create, delete, and replace social links for an event, as well as a function to refresh the event data after mutations. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The composable ensures that after any mutation, the event's data is refreshed by invalidating the cache, allowing subsequent reads to fetch the updated data from the server.
 * @param eventId A reactive reference containing the ID of the event for which the social links are being managed, allowing the composable to reactively update its behavior based on changes to the event ID.
 * @returns An object containing the loading state, error state, functions for updating, creating, deleting, and replacing social links, and a function for refreshing the event's data after mutations.
 */
export function useEventSocialLinksMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const currentEventId = computed(() => unref(eventId));

  /**
   * Updates a single social link for the current event based on the provided link ID and data.
   * @param linkId The ID of the social link to be updated.
   * @param data An object containing the updated information for the social link.
   * @param data.link The URL of the social link.
   * @param data.label The label for the social link.
   * @param data.order The order of the social link.
   * @returns A boolean value indicating the success of the update operation, where true represents a successful update and false indicates a failure due to an error during the mutation process.
   */
  async function updateLink(
    linkId: string,
    data: { link: string; label: string; order: number }
  ) {
    if (!currentEventId.value) return false;

    loading.value = true;
    clearError();

    try {
      await updateEventSocialLink(currentEventId.value, linkId, {
        ...data,
      });

      // Refresh the event data to get updated links.
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
   * Creates multiple social links for the current event based on the provided array of link data.
   * @param links An array of objects containing the information for each social link to be created.
   * @returns A boolean value indicating the success of the creation operation, where true represents a successful creation and false indicates a failure due to an error during the mutation process.
   */
  async function createLinks(links: SocialLinkInput[]) {
    if (!currentEventId.value || !links.length) return false;

    loading.value = true;
    clearError();

    try {
      await createEventSocialLinks(currentEventId.value, links);

      // Refresh the event data to get updated links.
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
   * Deletes a single social link for the current event based on the provided link ID.
   * @param linkId The ID of the social link to be deleted.
   * @returns A boolean value indicating the success of the deletion operation, where true represents a successful deletion and false indicates a failure due to an error during the mutation process.
   */
  async function deleteLink(linkId: string) {
    loading.value = true;
    clearError();

    try {
      await deleteEventSocialLink(linkId);

      // Refresh the event data to get updated links.
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
   * Replaces all social links for the current event based on the provided array of link data.
   * @param links An array of objects containing the information for each social link to be created.
   * @returns A boolean value indicating the success of the replacement operation, where true represents a successful replacement and false indicates a failure due to an error during the mutation process.
   */
  async function replaceAllLinks(
    links: { link: string; label: string; order: number }[]
  ) {
    if (!currentEventId.value) return false;

    loading.value = true;
    clearError();

    try {
      await replaceAllEventSocialLinks(currentEventId.value, links);

      // Refresh the event data to get updated links.
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
   * Refreshes the event data by invalidating the useAsyncData cache for the current event. This function ensures that the latest data is fetched after any mutations, such as updating, creating, deleting, or replacing social links.
   */
  async function refreshEventData() {
    if (!currentEventId.value) return;

    // Refresh the useAsyncData cache.
    await refreshNuxtData(getKeyForGetEvent(currentEventId.value));
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateLink,
    createLinks,
    deleteLink,
    replaceAllLinks,
    refreshEventData,
  };
}

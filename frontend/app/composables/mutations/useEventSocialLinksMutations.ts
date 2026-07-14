// SPDX-License-Identifier: AGPL-3.0-or-later
// Update event social links with error handling and store updates.

export function useEventSocialLinksMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const currentEventId = computed(() => unref(eventId));

  // Update a single social link.
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

      void invalidateCacheRefreshEventData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Create multiple social links.
  async function createLinks(links: SocialLinkInput[]) {
    if (!currentEventId.value || !links.length) return false;

    loading.value = true;
    clearError();

    try {
      await createEventSocialLinks(currentEventId.value, links);

      void invalidateCacheRefreshEventData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Delete a single social link.
  async function deleteLink(linkId: string) {
    loading.value = true;
    clearError();

    try {
      await deleteEventSocialLink(linkId);

      void invalidateCacheRefreshEventData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Replace all social links (delete all + create new ones).
  async function replaceAllLinks(
    links: { link: string; label: string; order: number }[]
  ) {
    if (!currentEventId.value) return false;

    loading.value = true;
    clearError();

    try {
      await replaceAllEventSocialLinks(currentEventId.value, links);

      void invalidateCacheRefreshEventData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Helper to refresh event data after mutations.
  async function invalidateCacheRefreshEventData() {
    if (!currentEventId.value) return;

    const key = getKeyForGetEvent(currentEventId.value);
    clearNuxtData(key);
    await refreshNuxtData(key);
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateLink,
    createLinks,
    deleteLink,
    replaceAllLinks,
    invalidateCacheRefreshEventData,
  };
}

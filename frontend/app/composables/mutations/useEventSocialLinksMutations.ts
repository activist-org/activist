// SPDX-License-Identifier: AGPL-3.0-or-later
// Update event social links with error handling and store updates.

export function useEventSocialLinksMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();
  // Captured at setup; useNuxtApp() would fail inside the deferred callback.
  const nuxtApp = useNuxtApp();

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

      scheduleEventRefresh();

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

      scheduleEventRefresh();

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

      scheduleEventRefresh();

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

      scheduleEventRefresh();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Defer to a macrotask so the modal closes before the refresh runs.
  function scheduleEventRefresh() {
    setTimeout(() => void nuxtApp.runWithContext(() => refreshEventData()), 0);
  }

  // Helper to refresh event data after mutations.
  async function refreshEventData() {
    if (!currentEventId.value) return;

    // Clear first: with dedupe "defer" a bare refreshNuxtData can be dropped on
    // collision, leaving the list stale (e.g. a deleted entry lingering).
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
    refreshEventData,
  };
}

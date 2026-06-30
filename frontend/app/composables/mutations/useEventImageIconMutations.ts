// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useEventImageIconMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();
  // Captured at setup; useNuxtApp() would fail inside the deferred callback.
  const nuxtApp = useNuxtApp();

  const currentEventId = computed(() => unref(eventId));
  const store = useEventListStore();

  // Upload new images.
  async function uploadIconImage(image: UploadableFile) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await uploadEventIconImage(currentEventId.value, image);

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
    // collision, leaving the data stale after a save.
    const key = getKeyForGetEvent(currentEventId.value);
    clearNuxtData(key);
    await refreshNuxtData(key);
    // Clear cached events to force refetch with new data.
    store.setItems([]);
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    uploadIconImage,
    refreshEventData,
  };
}

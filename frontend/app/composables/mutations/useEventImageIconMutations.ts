// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useEventImageIconMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const currentEventId = computed(() => unref(eventId));
  const store = useEventListStore();

  // Upload new images.
  async function uploadIconImage(image: UploadableFile) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await uploadEventIconImage(currentEventId.value, image);

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

  // Helper to refresh event data after mutations.
  async function refreshEventData() {
    if (!currentEventId.value) return;

    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(getKeyForGetEvent(currentEventId.value));
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

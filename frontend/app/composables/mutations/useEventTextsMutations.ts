// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useEventTextsMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const currentEventId = computed(() => unref(eventId));

  // Update event texts.
  async function updateTexts(
    textsData: EventUpdateTextFormData,
    textId: string
  ) {
    if (!currentEventId.value) return false;

    loading.value = true;
    clearError();
    try {
      // Service function handles the HTTP call and throws normalized errors.
      await updateEventTexts(currentEventId.value, textId, textsData);

      await invalidateCacheRefreshEventData();

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

    await refreshNuxtData(getKeyForGetEvent(currentEventId.value));
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateTexts,
    invalidateCacheRefreshEventData,
  };
}

// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useEventTextsMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();
  // Captured at setup; useNuxtApp() would fail inside the deferred callback.
  const nuxtApp = useNuxtApp();

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
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateTexts,
    refreshEventData,
  };
}

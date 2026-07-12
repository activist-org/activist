// SPDX-License-Identifier: AGPL-3.0-or-later

export function useEventDetailMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const currentEventId = computed(() => unref(eventId));

  async function updateDetails(eventData: UpdateEventDetailsInput) {
    if (!currentEventId.value) return false;

    loading.value = true;
    clearError();
    try {
      await updateEvent(currentEventId.value, eventData);
      await refreshEventData();
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function refreshEventData() {
    if (!currentEventId.value) return;

    await refreshNuxtData(getKeyForGetEvent(currentEventId.value));
  }

  return {
    loading: readonly(loading),
    error,
    updateDetails,
    refreshEventData,
  };
}

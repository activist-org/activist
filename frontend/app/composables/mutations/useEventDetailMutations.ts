// SPDX-License-Identifier: AGPL-3.0-or-later
export function useEventDetailMutations(eventId: MaybeRef<string>) {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentEventId = computed(() => unref(eventId));

  async function update(eventData: Partial<EventResponse>) {
    if (!currentEventId.value) return false;

    loading.value = true;
    error.value = null;
    try {
      await updateEvent(currentEventId.value, eventData);

      await refreshEventData();
      return true;
    } catch (err) {
      showToastError((err as AppError).message);
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
    error: readonly(error),
    update,
    refreshEventData,
  };
}

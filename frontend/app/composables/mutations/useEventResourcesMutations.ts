// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for Resource entries - uses direct service calls, not useAsyncData.

export function useEventResourcesMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();
  // Captured at setup; useNuxtApp() would fail inside the deferred callback.
  const nuxtApp = useNuxtApp();

  const currentEventId = computed(() => unref(eventId));

  // Create new resource.
  async function createResource(resourceData: ResourceInput) {
    if (!currentEventId.value) return false;

    loading.value = true;
    clearError();

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createEventResource(currentEventId.value, resourceData as Resource);

      scheduleEventRefresh();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Update existing resource.
  async function updateResource(resource: ResourceInput) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await updateEventResource(currentEventId.value, resource);

      scheduleEventRefresh();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Delete existing resource.
  async function deleteResource(resourceId: string) {
    loading.value = true;
    clearError();

    try {
      await deleteEventResource(resourceId);

      scheduleEventRefresh();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Reorder multiple resource entries.
  async function reorderResources(resources: Resource[]) {
    loading.value = true;
    clearError();
    try {
      await reorderEventResources(currentEventId.value, resources);

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
    createResource,
    updateResource,
    deleteResource,
    reorderResources,
    refreshEventData,
  };
}

// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useGroupTextsMutations(groupId: MaybeRef<string>) {
  const { showToastError } = useToaster();
  // Captured at setup; useNuxtApp() would fail inside the deferred callback.
  const nuxtApp = useNuxtApp();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentGroupId = computed(() => unref(groupId));

  // Update group texts.
  async function updateTexts(
    textsData: GroupUpdateTextFormData,
    textId: string
  ) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    error.value = null;
    try {
      // Service function handles the HTTP call and throws normalized errors.
      await updateGroupTexts(currentGroupId.value, textId, textsData);
      scheduleGroupRefresh();
      return true;
    } catch (err) {
      const appError = err as AppError;
      error.value = appError;
      showToastError(appError.message);
      return false;
    } finally {
      loading.value = false;
    }
  }
  // Defer to a macrotask so the modal closes before the refresh runs.
  function scheduleGroupRefresh() {
    setTimeout(() => void nuxtApp.runWithContext(() => refreshGroupData()), 0);
  }

  // Helper to refresh group data after mutations.
  async function refreshGroupData() {
    if (!currentGroupId.value) {
      return;
    }

    // Clear first: with dedupe "defer" a bare refreshNuxtData can be dropped on
    // collision, leaving the data stale after a save.
    const key = getKeyForGetGroup(currentGroupId.value);
    clearNuxtData(key);
    await refreshNuxtData(key);
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateTexts,
    refreshGroupData,
  };
}

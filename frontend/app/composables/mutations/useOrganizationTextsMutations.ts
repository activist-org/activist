// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useOrganizationTextsMutations(
  organizationId: MaybeRef<string>
) {
  const { showToastError } = useToaster();
  // Captured at setup; useNuxtApp() would fail inside the deferred callback.
  const nuxtApp = useNuxtApp();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentOrganizationId = computed(() => unref(organizationId));

  // Update organization texts.
  async function updateTexts(
    textsData: OrganizationUpdateTextFormData,
    textId: string
  ) {
    if (!currentOrganizationId.value) {
      return false;
    }

    loading.value = true;
    error.value = null;
    try {
      // Service function handles the HTTP call and throws normalized errors.
      await updateOrganizationTexts(
        currentOrganizationId.value,
        textId,
        textsData
      );
      scheduleOrganizationRefresh();
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
  function scheduleOrganizationRefresh() {
    setTimeout(
      () => void nuxtApp.runWithContext(() => refreshOrganizationData()),
      0
    );
  }

  // Helper to refresh organization data after mutations.
  async function refreshOrganizationData() {
    if (!currentOrganizationId.value) {
      return;
    }

    // Clear first: with dedupe "defer" a bare refreshNuxtData can be dropped on
    // collision, leaving the data stale after a save.
    const key = getKeyForGetOrganization(currentOrganizationId.value);
    clearNuxtData(key);
    await refreshNuxtData(key);
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateTexts,
    refreshOrganizationData,
  };
}

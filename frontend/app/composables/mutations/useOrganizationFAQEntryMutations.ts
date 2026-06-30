// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useOrganizationFAQEntryMutations(
  organizationId: MaybeRef<string>
) {
  const { showToastError } = useToaster();
  // Captured at setup; useNuxtApp() would fail inside the deferred callback.
  const nuxtApp = useNuxtApp();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentOrganizationId = computed(() => unref(organizationId));

  // Create new FAQ entry.
  async function createFAQ(faqData: Omit<FaqEntry, "id">) {
    if (!currentOrganizationId.value) {
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createOrganizationFaq(
        currentOrganizationId.value,
        faqData as FaqEntry
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

  // Update existing FAQ entry.
  async function updateFAQ(faq: FaqEntry) {
    loading.value = true;
    error.value = null;

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await updateOrganizationFaq(faq);

      scheduleOrganizationRefresh();

      return true;
    } catch (err) {
      const appError = errorHandler(err);
      error.value = appError;
      showToastError(appError.message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Reorder multiple FAQ entries.
  async function reorderFAQs(faqs: FaqEntry[]) {
    loading.value = true;
    error.value = null;

    try {
      await reorderOrganizationFaqs(faqs);

      scheduleOrganizationRefresh();

      return true;
    } catch (err) {
      const appError = errorHandler(err);
      error.value = appError;
      showToastError(appError.message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Delete FAQ entry.
  async function deleteFAQ(faqId: string) {
    loading.value = true;
    error.value = null;

    try {
      await deleteOrganizationFaq(faqId);

      scheduleOrganizationRefresh();

      return true;
    } catch (err) {
      const appError = errorHandler(err);
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
    // collision, leaving the list stale (e.g. a deleted entry lingering).
    const key = getKeyForGetOrganization(currentOrganizationId.value);
    clearNuxtData(key);
    await refreshNuxtData(key);
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    createFAQ,
    updateFAQ,
    reorderFAQs,
    deleteFAQ,
    refreshOrganizationData,
  };
}

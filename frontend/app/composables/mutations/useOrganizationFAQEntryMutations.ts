// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useOrganizationFAQEntryMutations(
  organizationId: MaybeRef<string>
) {
  const { showToastError } = useToaster();

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

      // Don't block the caller (e.g. a modal closing) on the background
      // refetch; the save has already succeeded at this point. Catch any
      // refresh failure so it doesn't surface as an unhandled rejection.
      invalidateCacheRefreshOrgData().catch((err) => {
        const appError = errorHandler(err);
        error.value = appError;
        showToastError(appError.message);
      });

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

      // Don't block the caller (e.g. a modal closing) on the background
      // refetch; the save has already succeeded at this point. Catch any
      // refresh failure so it doesn't surface as an unhandled rejection.
      invalidateCacheRefreshOrgData().catch((err) => {
        const appError = errorHandler(err);
        error.value = appError;
        showToastError(appError.message);
      });

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

      // Don't block the caller (e.g. a modal closing) on the background
      // refetch; the save has already succeeded at this point. Catch any
      // refresh failure so it doesn't surface as an unhandled rejection.
      invalidateCacheRefreshOrgData().catch((err) => {
        const appError = errorHandler(err);
        error.value = appError;
        showToastError(appError.message);
      });

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

      // Don't block the caller (e.g. a modal closing) on the background
      // refetch; the save has already succeeded at this point. Catch any
      // refresh failure so it doesn't surface as an unhandled rejection.
      invalidateCacheRefreshOrgData().catch((err) => {
        const appError = errorHandler(err);
        error.value = appError;
        showToastError(appError.message);
      });

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

  // Helper to refresh organization data after mutations.
  async function invalidateCacheRefreshOrgData() {
    if (!currentOrganizationId.value) return;

    await refreshNuxtData(
      getKeyForGetOrganization(currentOrganizationId.value)
    );
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    createFAQ,
    updateFAQ,
    reorderFAQs,
    deleteFAQ,
    invalidateCacheRefreshOrgData,
  };
}
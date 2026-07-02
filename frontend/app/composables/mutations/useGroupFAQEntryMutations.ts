// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useGroupFAQEntryMutations(groupId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));

  // Create new FAQ entry.
  async function createFAQ(faqData: Omit<FaqEntry, "id">) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createGroupFaq(currentGroupId.value, faqData as FaqEntry);

      invalidateCacheRefreshGroupData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Update existing FAQ entry.
  async function updateFAQ(faq: FaqEntry) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await updateGroupFaq(faq);

      invalidateCacheRefreshGroupData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Reorder multiple FAQ entries.
  async function reorderFAQs(faqs: FaqEntry[]) {
    loading.value = true;
    clearError();

    try {
      await reorderGroupFaqs(faqs);

      invalidateCacheRefreshGroupData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Delete FAQ entry.
  async function deleteFAQ(faqId: string) {
    loading.value = true;
    clearError();

    try {
      await deleteGroupFaq(faqId);

      invalidateCacheRefreshGroupData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Helper to refresh group data after mutations.
  async function invalidateCacheRefreshGroupData() {
    if (!currentGroupId.value) {
      return;
    }

    // Clear first: with dedupe "defer" a bare refreshNuxtData can be dropped on
    // collision, leaving the list stale (e.g. a deleted entry lingering).
    const key = getKeyForGetGroup(currentGroupId.value);
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
    invalidateCacheRefreshGroupData,
  };
}

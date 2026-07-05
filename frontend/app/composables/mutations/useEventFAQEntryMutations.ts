// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useEventFAQEntryMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const currentEventId = computed(() => unref(eventId));

  // Create new FAQ entry.
  async function createFAQ(faqData: Omit<FaqEntry, "id">) {
    if (!currentEventId.value) return false;

    loading.value = true;
    clearError();

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createEventFaq(currentEventId.value, faqData as FaqEntry);

      // Don't block the caller (e.g. a modal closing) on the background
      // refetch; the save has already succeeded at this point.
      invalidateCacheRefreshEventData().catch((err) => handleError(err));

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
      await updateEventFaq(currentEventId.value, faq);

      // Don't block the caller (e.g. a modal closing) on the background
      // refetch; the save has already succeeded at this point.
      invalidateCacheRefreshEventData().catch((err) => handleError(err));

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
      await reorderEventFaqs(currentEventId.value, faqs);

      // Don't block the caller (e.g. a modal closing) on the background
      // refetch; the save has already succeeded at this point.
      invalidateCacheRefreshEventData().catch((err) => handleError(err));

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
      await deleteEventFaq(faqId);

      // Don't block the caller (e.g. a modal closing) on the background
      // refetch; the save has already succeeded at this point.
      invalidateCacheRefreshEventData().catch((err) => handleError(err));

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

    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(getKeyForGetEvent(currentEventId.value));
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    createFAQ,
    updateFAQ,
    reorderFAQs,
    deleteFAQ,
    invalidateCacheRefreshEventData,
  };
}
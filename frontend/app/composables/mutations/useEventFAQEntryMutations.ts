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

      // Refresh the event data to get the new FAQ.
      await refreshEventData();

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

      // Invalidate cache and refetch fresh data.
      await refreshEventData();

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

      // Refresh to get the updated order.
      await refreshEventData();

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

      // Refresh to get the updated list.
      await refreshEventData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Helper to refresh event data after mutations.
  async function refreshEventData() {
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
    refreshEventData,
  };
}

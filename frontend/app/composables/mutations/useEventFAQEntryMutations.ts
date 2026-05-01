// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useEventFAQEntryMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentEventId = computed(() => unref(eventId));
  const { invalidateEventCache } = useEventCache();

  // Update existing FAQ entry.
  const {
    mutate: createFAQ,
    isLoading: loadingCreateFAQ,
  } = useMutation({
    mutation: (faqData: Omit<FaqEntry, "id">) =>
      createEventFaq(currentEventId.value, faqData as FaqEntry),
    async onSettled() {
      await invalidateEventCache(currentEventId.value);
    },
    onError(err) {
      handleError(err);
    },
  });


  // Reorder multiple FAQ entries.
  const {
    mutate: reorderFAQs,
    isLoading: loadingReorderFAQs,
  } = useMutation({
    mutation: (orderedFaqs: FaqEntry[]) =>
      reorderEventFaqs(currentEventId.value, orderedFaqs),
    async onSettled() {
      await invalidateEventCache(currentEventId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  // Delete FAQ entry.
  const {
    mutate: deleteFAQ,
    isLoading: loadingDeleteFAQ,
  } = useMutation({
    mutation: (faqId: string) => deleteEventFaq(faqId),
    async onSettled() {
      await invalidateEventCache(currentEventId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  // Update existing FAQ entry.
  const {
    mutate: updateFAQ,
    isLoading: loadingUpdateFAQ,
  } = useMutation({
    mutation: (faqData: FaqEntry) =>
      updateEventFaq(currentEventId.value, faqData),
    async onSettled() {
      await invalidateEventCache(currentEventId.value);
    },
    onError(err) {
      handleError(err);
    },
  });
  watch(
    [loadingCreateFAQ, loadingUpdateFAQ, loadingDeleteFAQ, loadingReorderFAQs],
    ([create, update, del, reorder]) => {
      loading.value = create || update || del || reorder;
    }
  );
  return {
    loading: readonly(loading),
    error: readonly(error),
    createFAQ,
    updateFAQ,
    reorderFAQs,
    deleteFAQ
  };
}

// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useEventFAQEntryMutations(
  eventId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentEventId = computed(() => unref(eventId));
  const { invalidateEventCache } = useEventCache();

  // Update existing FAQ entry.
  const { mutate: createFAQ, isLoading: loadingCreateFAQ } = useMutation({
    ...options.create,
    mutation: (faqData: Omit<FaqEntry, "id">) =>
      createEventFaq(currentEventId.value, faqData as FaqEntry),
    async onSuccess() {
      await invalidateEventCache(currentEventId.value);
      options.create?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  const { mutate: reorderFAQs, isLoading: loadingReorderFAQs } = useMutation({
    ...options.reorder,
    mutation: (orderedFaqs: FaqEntry[]) =>
      reorderEventFaqs(currentEventId.value, orderedFaqs),
    async onSuccess() {
      await invalidateEventCache(currentEventId.value);
      options.reorder?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Delete FAQ entry.
  const { mutate: deleteFAQ, isLoading: loadingDeleteFAQ } = useMutation({
    ...options.delete,
    mutation: (faqId: string) => deleteEventFaq(faqId),
    async onSuccess() {
      await invalidateEventCache(currentEventId.value);
      options.delete?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Update existing FAQ entry.
  const { mutate: updateFAQ, isLoading: loadingUpdateFAQ } = useMutation({
    ...options.update,
    mutation: (faqData: FaqEntry) =>
      updateEventFaq(currentEventId.value, faqData),
    async onSuccess() {
      await invalidateEventCache(currentEventId.value);
      options.update?.onSuccess?.();
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
    deleteFAQ,
  };
}

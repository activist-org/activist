// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses Pinia Colada for cache invalidation.

export function useGroupFAQEntryMutations(groupId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache } = useGroupCache();

  // Create new FAQ entry.
  const { mutateAsync: createFAQ, isLoading: loadingCreateFAQ } = useMutation({
    mutation: (faqData: Omit<FaqEntry, "id">) =>
      createGroupFaq(currentGroupId.value, faqData as FaqEntry),
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  // Update existing FAQ entry.
  const { mutateAsync: updateFAQ, isLoading: loadingUpdateFAQ } = useMutation({
    mutation: (faq: FaqEntry) => updateGroupFaq(faq),
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  // Reorder multiple FAQ entries.
  const { mutateAsync: reorderFAQs, isLoading: loadingReorderFAQs } =
    useMutation({
      mutation: (faqs: FaqEntry[]) => reorderGroupFaqs(faqs),
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete FAQ entry.
  const { mutateAsync: deleteFAQ, isLoading: loadingDeleteFAQ } = useMutation({
    mutation: (faqId: string) => deleteGroupFaq(faqId),
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
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

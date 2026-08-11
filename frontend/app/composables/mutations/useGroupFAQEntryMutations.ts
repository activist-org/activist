// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses Pinia Colada for cache invalidation.

export function useGroupFAQEntryMutations(
  groupId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache } = useGroupCache();

  // Create new FAQ entry.
  const { mutate: createFAQ, isLoading: loadingCreateFAQ } = useMutation({
    mutation: (faqData: Omit<FaqEntry, "id">) =>
      createGroupFaq(currentGroupId.value, faqData as FaqEntry),
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
      options.create?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.create,
  });

  // Update existing FAQ entry.
  const { mutate: updateFAQ, isLoading: loadingUpdateFAQ } = useMutation({
    mutation: (faq: FaqEntry) => updateGroupFaq(faq),
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
      options.update?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.update,
  });

  // Reorder multiple FAQ entries.
  const { mutate: reorderFAQs, isLoading: loadingReorderFAQs } = useMutation({
    mutation: (faqs: FaqEntry[]) => reorderGroupFaqs(faqs),
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
      options.reorder?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.reorder,
  });

  // Delete FAQ entry.
  const { mutate: deleteFAQ, isLoading: loadingDeleteFAQ } = useMutation({
    mutation: (faqId: string) => deleteGroupFaq(faqId),
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
      options.delete?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.delete,
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

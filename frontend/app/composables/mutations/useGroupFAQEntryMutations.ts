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
    ...options.create,
    mutation: (faqData: Omit<FaqEntry, "id">) =>
      createGroupFaq(currentGroupId.value, faqData as FaqEntry),
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
      options.create?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Update existing FAQ entry.
  const { mutate: updateFAQ, isLoading: loadingUpdateFAQ } = useMutation({
    ...options.update,
    mutation: (faq: FaqEntry) => updateGroupFaq(faq),
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
      options.update?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Reorder multiple FAQ entries.
  const { mutate: reorderFAQs, isLoading: loadingReorderFAQs } = useMutation({
    ...options.reorder,
    mutation: (faqs: FaqEntry[]) => reorderGroupFaqs(faqs),
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
      options.reorder?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Delete FAQ entry.
  const { mutate: deleteFAQ, isLoading: loadingDeleteFAQ } = useMutation({
    ...options.delete,
    mutation: (faqId: string) => deleteGroupFaq(faqId),
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
      options.delete?.onSuccess?.();
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

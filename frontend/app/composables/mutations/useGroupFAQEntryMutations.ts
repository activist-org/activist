// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses Pinia Colada for cache invalidation.

export function useGroupFAQEntryMutations(groupId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache } = useGroupCache();

  // Create new FAQ entry.
  const { mutateAsync: createFAQAsync, isLoading: loadingCreateFAQ } =
    useMutation({
      mutation: (faqData: Omit<FaqEntry, "id">) =>
        createGroupFaq(currentGroupId.value, faqData as FaqEntry),
      async onSettled() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Update existing FAQ entry.
  const { mutateAsync: updateFAQAsync, isLoading: loadingUpdateFAQ } =
    useMutation({
      mutation: (faq: FaqEntry) => updateGroupFaq(faq),
      async onSettled() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Reorder multiple FAQ entries.
  const { mutateAsync: reorderFAQsAsync, isLoading: loadingReorderFAQs } =
    useMutation({
      mutation: (faqs: FaqEntry[]) => reorderGroupFaqs(faqs),
      async onSettled() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete FAQ entry.
  const { mutateAsync: deleteFAQAsync, isLoading: loadingDeleteFAQ } =
    useMutation({
      mutation: (faqId: string) => deleteGroupFaq(faqId),
      async onSettled() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Wrappers keep the true/false contract that call sites rely on.
  const createFAQ = async (faqData: Omit<FaqEntry, "id">) => {
    if (!currentGroupId.value) return false;
    try {
      await createFAQAsync(faqData);
      return true;
    } catch {
      return false;
    }
  };

  const updateFAQ = async (faq: FaqEntry) => {
    try {
      await updateFAQAsync(faq);
      return true;
    } catch {
      return false;
    }
  };

  const reorderFAQs = async (faqs: FaqEntry[]) => {
    try {
      await reorderFAQsAsync(faqs);
      return true;
    } catch {
      return false;
    }
  };

  const deleteFAQ = async (faqId: string) => {
    try {
      await deleteFAQAsync(faqId);
      return true;
    } catch {
      return false;
    }
  };

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

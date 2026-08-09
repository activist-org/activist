// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses Pinia Colada for cache invalidation.

export function useOrganizationFAQEntryMutations(
  organizationId: MaybeRef<string>
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentOrganizationId = computed(() => unref(organizationId));
  const { invalidateOrganizationCache } = useOrganizationCache();

  // Create new FAQ entry.
  const { mutateAsync: createFAQAsync, isLoading: loadingCreateFAQ } =
    useMutation({
      mutation: (faqData: Omit<FaqEntry, "id">) =>
        createOrganizationFaq(currentOrganizationId.value, faqData as FaqEntry),
      async onSettled() {
        await invalidateOrganizationCache(currentOrganizationId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Update existing FAQ entry.
  const { mutateAsync: updateFAQAsync, isLoading: loadingUpdateFAQ } =
    useMutation({
      mutation: (faq: FaqEntry) => updateOrganizationFaq(faq),
      async onSettled() {
        await invalidateOrganizationCache(currentOrganizationId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Reorder multiple FAQ entries.
  const { mutateAsync: reorderFAQsAsync, isLoading: loadingReorderFAQs } =
    useMutation({
      mutation: (faqs: FaqEntry[]) => reorderOrganizationFaqs(faqs),
      async onSettled() {
        await invalidateOrganizationCache(currentOrganizationId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete FAQ entry.
  const { mutateAsync: deleteFAQAsync, isLoading: loadingDeleteFAQ } =
    useMutation({
      mutation: (faqId: string) => deleteOrganizationFaq(faqId),
      async onSettled() {
        await invalidateOrganizationCache(currentOrganizationId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Wrappers keep the true/false contract that call sites rely on.
  const createFAQ = async (faqData: Omit<FaqEntry, "id">) => {
    if (!currentOrganizationId.value) return false;
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

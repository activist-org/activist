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
  const { mutateAsync: createFAQ, isLoading: loadingCreateFAQ } = useMutation({
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
  const { mutateAsync: updateFAQ, isLoading: loadingUpdateFAQ } = useMutation({
    mutation: (faq: FaqEntry) => updateOrganizationFaq(faq),
    async onSettled() {
      await invalidateOrganizationCache(currentOrganizationId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  // Reorder multiple FAQ entries.
  const { mutateAsync: reorderFAQs, isLoading: loadingReorderFAQs } =
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
  const { mutateAsync: deleteFAQ, isLoading: loadingDeleteFAQ } = useMutation({
    mutation: (faqId: string) => deleteOrganizationFaq(faqId),
    async onSuccess() {
      await invalidateOrganizationCache(currentOrganizationId.value);
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

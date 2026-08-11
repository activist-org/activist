// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses Pinia Colada for cache invalidation.

export function useOrganizationFAQEntryMutations(
  organizationId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentOrganizationId = computed(() => unref(organizationId));
  const { invalidateOrganizationCache } = useOrganizationCache();

  // Create new FAQ entry.
  const { mutate: createFAQ, isLoading: loadingCreateFAQ } = useMutation({
    mutation: (faqData: Omit<FaqEntry, "id">) =>
      createOrganizationFaq(currentOrganizationId.value, faqData as FaqEntry),
    async onSuccess() {
      await invalidateOrganizationCache(currentOrganizationId.value);
      options.create?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.create,
  });

  // Update existing FAQ entry.
  const { mutate: updateFAQ, isLoading: loadingUpdateFAQ } = useMutation({
    mutation: (faq: FaqEntry) => updateOrganizationFaq(faq),
    async onSuccess() {
      await invalidateOrganizationCache(currentOrganizationId.value);
      options.update?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.update,
  });

  // Reorder multiple FAQ entries.
  const { mutate: reorderFAQs, isLoading: loadingReorderFAQs } = useMutation({
    mutation: (faqs: FaqEntry[]) => reorderOrganizationFaqs(faqs),
    async onSuccess() {
      await invalidateOrganizationCache(currentOrganizationId.value);
      options.reorder?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Delete FAQ entry.
  const { mutate: deleteFAQ, isLoading: loadingDeleteFAQ } = useMutation({
    mutation: (faqId: string) => deleteOrganizationFaq(faqId),
    async onSuccess() {
      await invalidateOrganizationCache(currentOrganizationId.value);
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

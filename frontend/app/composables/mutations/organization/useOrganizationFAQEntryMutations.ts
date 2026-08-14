// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses Pinia Colada for cache invalidation.

export function useOrganizationFAQEntryMutations(
  orgId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentOrgId = computed(() => unref(orgId));
  const { invalidateOrganizationCache } = useOrganizationCache();

  // Create new FAQ entry.
  const { mutate: createFAQ, isLoading: loadingCreateFAQ } = useMutation({
    ...options.create,
    mutation: (faqData: Omit<FaqEntry, "id">) =>
      createOrganizationFaq(currentOrgId.value, faqData as FaqEntry),
    async onSuccess() {
      await invalidateOrganizationCache(currentOrgId.value);
      options.create?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Update existing FAQ entry.
  const { mutate: updateFAQ, isLoading: loadingUpdateFAQ } = useMutation({
    ...options.update,
    mutation: (faq: FaqEntry) => updateOrganizationFaq(faq),
    async onSuccess() {
      await invalidateOrganizationCache(currentOrgId.value);
      options.update?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Reorder multiple FAQ entries.
  const { mutate: reorderFAQs, isLoading: loadingReorderFAQs } = useMutation({
    ...options.reorder,
    mutation: (faqs: FaqEntry[]) => reorderOrganizationFaqs(faqs),
    async onSuccess() {
      await invalidateOrganizationCache(currentOrgId.value);
      options.reorder?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Delete FAQ entry.
  const { mutate: deleteFAQ, isLoading: loadingDeleteFAQ } = useMutation({
    ...options.delete,
    mutation: (faqId: string) => deleteOrganizationFaq(faqId),
    async onSuccess() {
      await invalidateOrganizationCache(currentOrgId.value);
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

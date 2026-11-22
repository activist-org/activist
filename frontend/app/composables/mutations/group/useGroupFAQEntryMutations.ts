// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses Pinia Colada for cache invalidation.

import type { FaqEntry } from "~~/shared/types/faq-entry";

export function useGroupFAQEntryMutations(
  groupId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache, getKeyForGroup } = useGroupCache();
  const queryCache = useQueryCache();

  // Create new FAQ entry.
  const { mutate: createFAQ, isLoading: loadingCreateFAQ } = useCustomMutation(
    options.create,
    (faqData: Omit<FaqEntry, "id">) =>
      createGroupFaq(currentGroupId.value, faqData as FaqEntry),
    invalidateGroupCache,
    currentGroupId
  );

  // Update existing FAQ entry.
  const { mutate: updateFAQ, isLoading: loadingUpdateFAQ } = useCustomMutation(
    options.update,
    (faq: FaqEntry) => updateGroupFaq(faq),
    invalidateGroupCache,
    currentGroupId
  );

  // Reorder multiple FAQ entries.
  const { mutate: reorderFAQs, isLoading: loadingReorderFAQs } = useMutation({
    ...options.reorder,
    mutation: (faqs: FaqEntry[]) => reorderGroupFaqs(faqs),
    onMutate(faqs) {
      const key = getKeyForGroup(currentGroupId.value);
      const previousGroup = queryCache.getQueryData<Group>(key);
      if (previousGroup) {
        queryCache.setQueryData(key, {
          ...previousGroup,
          faqEntries: faqs,
        });
      }
      return { previousGroup };
    },
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
      options.reorder?.onSuccess?.();
    },
    onError(err, _faqs, context) {
      if (context?.previousGroup) {
        queryCache.setQueryData(
          getKeyForGroup(currentGroupId.value),
          context.previousGroup
        );
      }
      handleError(err);
    },
  });

  // Delete FAQ entry.
  const { mutate: deleteFAQ, isLoading: loadingDeleteFAQ } = useCustomMutation(
    options.delete,
    (faqId: string) => deleteGroupFaq(faqId),
    invalidateGroupCache,
    currentGroupId
  );

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

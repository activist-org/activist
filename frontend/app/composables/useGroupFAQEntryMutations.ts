// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.


import {
  createGroupFaq,
  deleteGroupFaq,
  reorderGroupFaqs,
  updateGroupFaq,
} from "~/services/communities/group/faq";

export function useGroupFAQEntryMutations(groupId: MaybeRef<string>) {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentGroupId = computed(() => unref(groupId));

  // Create new FAQ entry.
  async function createFAQ(faqData: Omit<FaqEntry, "id">) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createGroupFaq(currentGroupId.value, faqData as FaqEntry);

      // Refresh the group data to get the new FAQ.
      await refreshGroupData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Update existing FAQ entry.
  async function updateFAQ(faq: FaqEntry) {
    loading.value = true;
    error.value = null;

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await updateGroupFaq(faq);

      // Invalidate cache and refetch fresh data.
      await refreshGroupData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Reorder multiple FAQ entries.
  async function reorderFAQs(faqs: FaqEntry[]) {
    loading.value = true;
    error.value = null;

    try {
      await reorderGroupFaqs(faqs);

      // Refresh to get the updated order.
      await refreshGroupData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Delete FAQ entry.
  async function deleteFAQ(faqId: string) {
    loading.value = true;
    error.value = null;

    try {
      await deleteGroupFaq(faqId);

      // Refresh to get the updated list.
      await refreshGroupData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Helper to refresh group data after mutations.
  async function refreshGroupData() {
    if (!currentGroupId.value) {
      return;
    }

    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(getKeyForGetGroup(currentGroupId.value));
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    createFAQ,
    updateFAQ,
    reorderFAQs,
    deleteFAQ,
    refreshGroupData,
  };
}

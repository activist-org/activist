// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

import type { MaybeRef } from "vue";

import type { FaqEntry } from "~/types/content/faq-entry";
import type { AppError } from "~/utils/errorHandler";

import {
  createOrganizationFaq,
  deleteOrganizationFaq,
  reorderOrganizationFaqs,
  updateOrganizationFaq,
} from "~/services/communities/organization/faq";

import { getKeyForGetOrganization } from "../queries/useGetOrganization";

export function useOrganizationFAQEntryMutations(
  organizationId: MaybeRef<string>
) {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentOrganizationId = computed(() => unref(organizationId));

  // Create new FAQ entry.
  async function createFAQ(faqData: Omit<FaqEntry, "id">) {
    if (!currentOrganizationId.value) {
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createOrganizationFaq(
        currentOrganizationId.value,
        faqData as FaqEntry
      );

      // Refresh the organization data to get the new FAQ.
      await refreshOrganizationData();

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
      await updateOrganizationFaq(faq);

      // Invalidate cache and refetch fresh data.
      await refreshOrganizationData();

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
      await reorderOrganizationFaqs(faqs);

      // Refresh to get the updated order.
      await refreshOrganizationData();

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
      await deleteOrganizationFaq(faqId);

      // Refresh to get the updated list.
      await refreshOrganizationData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Helper to refresh organization data after mutations.
  async function refreshOrganizationData() {
    if (!currentOrganizationId.value) {
      return;
    }

    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(
      getKeyForGetOrganization(currentOrganizationId.value)
    );
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    createFAQ,
    updateFAQ,
    reorderFAQs,
    deleteFAQ,
    refreshOrganizationData,
  };
}

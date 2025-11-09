// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

import type { MaybeRef } from "vue";

import type { FaqEntry } from "~/types/content/faq-entry";
import type { AppError } from "~/utils/errorHandler";

import {
  createEventFaq,
  deleteEventFaq,
  reorderEventFaqs,
  updateEventFaq,
} from "~/services/event/faq";

import { getKeyForGetEvent } from "../queries/useGetEvent";

export function useEventFAQEntryMutations(eventId: MaybeRef<string>) {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentEventId = computed(() => unref(eventId));

  // Create new FAQ entry.
  async function createFAQ(faqData: Omit<FaqEntry, "id">) {
    if (!currentEventId.value) return false;

    loading.value = true;
    error.value = null;

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createEventFaq(currentEventId.value, faqData as FaqEntry);

      // Refresh the event data to get the new FAQ.
      await refreshEventData();

      return true;
    } catch (err) {
      const appError = errorHandler(err);
      error.value = appError;
      showToastError(appError.message);
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
      await updateEventFaq(currentEventId.value, faq);

      // Invalidate cache and refetch fresh data.
      await refreshEventData();

      return true;
    } catch (err) {
      const appError = errorHandler(err);
      error.value = appError;
      showToastError(appError.message);
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
      await reorderEventFaqs(currentEventId.value, faqs);

      // Refresh to get the updated order.
      await refreshEventData();

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
      await deleteEventFaq(faqId);

      // Refresh to get the updated list.
      await refreshEventData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Helper to refresh event data after mutations.
  async function refreshEventData() {
    if (!currentEventId.value) return;

    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(getKeyForGetEvent(currentEventId.value));
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    createFAQ,
    updateFAQ,
    reorderFAQs,
    deleteFAQ,
    refreshEventData,
  };
}

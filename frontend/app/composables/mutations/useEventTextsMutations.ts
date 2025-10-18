// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

import type { MaybeRef } from "vue";

import type { EventUpdateTextFormData } from "~/types/events/event";
import type { AppError } from "~/utils/errorHandler";

import { updateEventTexts } from "~/services/event/text";

import { getKeyForGetEvent } from "../queries/useGetEvent";

export function useEventTextsMutations(eventId: MaybeRef<string>) {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentEventId = computed(() => unref(eventId));

  // Update event texts.
  async function updateTexts(
    textsData: EventUpdateTextFormData,
    textId: string
  ) {
    if (!currentEventId.value) return false;

    loading.value = true;
    error.value = null;
    try {
      // Service function handles the HTTP call and throws normalized errors.
      await updateEventTexts(currentEventId.value, textId, textsData);

      // Refresh the event data to get the updated texts.
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
    updateTexts,
    refreshEventData,
  };
}

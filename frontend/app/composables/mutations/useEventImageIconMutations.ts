// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData

import type { MaybeRef } from "vue";

import type { UploadableFile } from "~/types/content/file";

import { uploadEventIconImage } from "~/services/event";
import { errorHandler } from "~/utils/errorHandler";

export function useEventImageIconMutations(eventId: MaybeRef<string>) {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentEventId = computed(() => unref(eventId));

  // Upload new images
  async function uploadIconImage(image: UploadableFile) {
    loading.value = true;
    error.value = null;

    try {
      // Direct service call - no useAsyncData needed for mutations
      await uploadEventIconImage(currentEventId.value, image);

      // Invalidate cache and refetch fresh data
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

  // Helper to refresh event data after mutations
  async function refreshEventData() {
    if (!currentEventId.value) return;

    // Invalidate the useAsyncData cache so next read will refetch
    await refreshNuxtData(`event:${currentEventId.value}`);
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    uploadIconImage,
    refreshEventData,
  };
}

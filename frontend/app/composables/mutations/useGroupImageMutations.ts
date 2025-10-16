// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData

import type { MaybeRef } from "vue";

import type { ContentImage, UploadableFile } from "~/types/content/file";
import type { AppError } from "~/utils/errorHandler";

import {
  updateGroupImage,
  uploadGroupImages,
} from "~/services/communities/group/image";

import { getKeyForGetGroupImages } from "../queries/useGetGroupImages";

export function useGroupImageMutations(groupId: MaybeRef<string>) {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentGroupId = computed(() => unref(groupId));

  // Update existing image.
  async function updateImage(contentImage: ContentImage) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await updateGroupImage(
        currentGroupId.value,
        contentImage as ContentImage
      );

      // Refresh the group data to get the new resource.
      await refreshGroupData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Upload new images.
  async function uploadImages(images: UploadableFile[], sequences?: number[]) {
    loading.value = true;
    error.value = null;

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await uploadGroupImages(currentGroupId.value, images, sequences);

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

  // Helper to refresh group data after mutations.
  async function refreshGroupData() {
    if (!currentGroupId.value) {
      return;
    }

    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(getKeyForGetGroupImages(currentGroupId.value));
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateImage,
    uploadImages,
    refreshGroupData,
  };
}

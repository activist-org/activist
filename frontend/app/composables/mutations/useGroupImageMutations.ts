// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for images - uses direct service calls, not useAsyncData.

export function useGroupImageMutations(groupId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();
  // Captured at setup; useNuxtApp() would fail inside the deferred callback.
  const nuxtApp = useNuxtApp();

  const currentGroupId = computed(() => unref(groupId));

  // Update existing image.
  async function updateImage(contentImage: ContentImage) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await updateGroupImage(
        currentGroupId.value,
        contentImage as ContentImage
      );

      scheduleGroupRefresh();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Upload new images.
  async function uploadImages(images: UploadableFile[], sequences?: number[]) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await uploadGroupImages(currentGroupId.value, images, sequences);

      scheduleGroupRefresh();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Defer to a macrotask so the modal closes before the refresh runs.
  function scheduleGroupRefresh() {
    setTimeout(() => void nuxtApp.runWithContext(() => refreshGroupData()), 0);
  }

  // Helper to refresh group data after mutations.
  async function refreshGroupData() {
    if (!currentGroupId.value) {
      return;
    }

    // Clear first: with dedupe "defer" a bare refreshNuxtData can be dropped on
    // collision, leaving the data stale after a save.
    const key = getKeyForGetGroupImages(currentGroupId.value);
    clearNuxtData(key);
    await refreshNuxtData(key);
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateImage,
    uploadImages,
    refreshGroupData,
  };
}

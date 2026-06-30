// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useOrganizationImageMutations(
  organizationId: MaybeRef<string>
) {
  const { showToastError } = useToaster();
  // Captured at setup; useNuxtApp() would fail inside the deferred callback.
  const nuxtApp = useNuxtApp();

  const loading = ref(false);
  const error = ref<Error | null>(null);
  const store = useOrganizationListStore();

  const currentOrganizationId = computed(() => unref(organizationId));

  // Update existing image.
  async function updateImage(contentImage: ContentImage) {
    if (!currentOrganizationId.value) {
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await updateOrganizationImage(
        currentOrganizationId.value,
        contentImage as ContentImage
      );

      scheduleOrganizationImagesRefresh();

      return true;
    } catch (err) {
      const appError = err as AppError;
      error.value = appError;
      showToastError(appError.message);
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
      await uploadOrganizationImages(
        currentOrganizationId.value,
        images,
        sequences
      );

      scheduleOrganizationImagesRefresh();

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

  // Upload new images.
  async function uploadIconImage(image: UploadableFile) {
    loading.value = true;
    error.value = null;

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await uploadOrganizationIconImage(currentOrganizationId.value, image);

      scheduleOrganizationRefresh();

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

  // Defer to a macrotask so the modal closes before the refresh runs.
  function scheduleOrganizationRefresh() {
    setTimeout(
      () => void nuxtApp.runWithContext(() => refreshOrganizationData()),
      0
    );
  }

  // Helper to refresh organization data after mutations.
  async function refreshOrganizationData() {
    if (!currentOrganizationId.value) {
      return;
    }

    // Clear first: with dedupe "defer" a bare refreshNuxtData can be dropped on
    // collision, leaving the data stale after a save.
    const key = getKeyForGetOrganization(currentOrganizationId.value);
    clearNuxtData(key);
    await refreshNuxtData(key);
    // Clear the organizations list cache to ensure it refetches with updated data.
    store.setItems([]);
    // Also refresh the list of organizations in case the image is used there.
    const listKey = getKeyForGetOrganizations();
    clearNuxtData(listKey);
    await refreshNuxtData(listKey);
  }

  // Defer to a macrotask so the modal closes before the refresh runs.
  function scheduleOrganizationImagesRefresh() {
    setTimeout(
      () => void nuxtApp.runWithContext(() => refreshOrganizationImagesData()),
      0
    );
  }

  // Helper to refresh organization images data after mutations.
  async function refreshOrganizationImagesData() {
    if (!currentOrganizationId.value) {
      return;
    }

    // Clear first: with dedupe "defer" a bare refreshNuxtData can be dropped on
    // collision, leaving the data stale after a save.
    const key = getKeyForGetOrganizationImages(currentOrganizationId.value);
    clearNuxtData(key);
    await refreshNuxtData(key);
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateImage,
    uploadImages,
    refreshOrganizationData,
    refreshOrganizationImagesData,
    uploadIconImage,
  };
}

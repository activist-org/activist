// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useOrganizationImageMutations(
  organizationId: MaybeRef<string>
) {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

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

      // Refresh the organization data to get the new resource.
      await refreshOrganizationImagesData();

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
      await uploadOrganizationImages(
        currentOrganizationId.value,
        images,
        sequences
      );

      // Invalidate cache and refetch fresh data.
      await refreshOrganizationImagesData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
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

      // Invalidate cache and refetch fresh data.
      await refreshOrganizationData();

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

  // Helper to refresh organization data after mutations.
  async function refreshOrganizationImagesData() {
    if (!currentOrganizationId.value) {
      return;
    }

    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(
      getKeyForGetOrganizationImages(currentOrganizationId.value)
    );
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

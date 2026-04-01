// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Composable for managing mutations related to organization images in the frontend application. This composable provides functions to update existing images, upload new images, and refresh the organization data after mutations. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The composable ensures that after any mutation, the organization's data is refreshed by invalidating the cache, allowing subsequent reads to fetch the updated data from the server.
 * @param organizationId A reactive reference containing the ID of the organization for which the images are being managed, allowing the composable to reactively update its behavior based on changes to the organization ID.
 * @returns An object containing the loading state, error state, functions for updating and uploading images, and functions for refreshing the organization's data after mutations.
 */
export function useOrganizationImageMutations(
  organizationId: MaybeRef<string>
) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();
  const store = useOrganizationListStore();

  const currentOrganizationId = computed(() => unref(organizationId));

  /**
   * Updates an existing image for the organization based on the provided image data. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful update. It allows for updating an existing image by accepting an object containing the image information and ensures that the organization's data is updated to reflect the changes.
   * @param contentImage An object containing the updated image information. The function uses this data to perform the update operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the update operation, where true represents a successful update and false indicates a failure due to an error during the mutation process.
   */
  async function updateImage(contentImage: ContentImage) {
    if (!currentOrganizationId.value) {
      return false;
    }

    loading.value = true;
    clearError();

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
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Uploads new images for the organization based on the provided image files and optional sequences. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful upload. It allows for uploading new images by accepting an array of image files and optional sequences, and ensures that the organization's data is updated to reflect the changes.
   * @param images An array of image files to be uploaded. The function uses these files to perform the upload operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @param sequences An optional array of sequences corresponding to the images. The function uses these sequences to determine the order of the images and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the upload operation, where true represents a successful upload and false indicates a failure due to an error during the mutation process.
   */
  async function uploadImages(images: UploadableFile[], sequences?: number[]) {
    loading.value = true;
    clearError();
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
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Upload new images.
  /**
   * Uploads a new icon image for the organization based on the provided image file. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the organization data after a successful upload. It allows for uploading a new icon image by accepting an image file and ensures that the organization's data is updated to reflect the changes.
   * @param image The image file to be uploaded as the organization's icon. The function uses this file to perform the upload operation and ensures that the organization's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the upload operation, where true represents a successful upload and false indicates a failure due to an error during the mutation process.
   */
  async function uploadIconImage(image: UploadableFile) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await uploadOrganizationIconImage(currentOrganizationId.value, image);

      // Invalidate cache and refetch fresh data.
      await refreshOrganizationData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Refreshes the organization data by invalidating the cache.
   * This function ensures that subsequent reads will fetch the updated data from the server, allowing the frontend application to reflect the changes made to the organization's images after any mutation operation.
   * By calling this function after mutations, it guarantees that the latest organization data is available for components that rely on it, providing a consistent and up-to-date user experience.
   */
  async function refreshOrganizationData() {
    if (!currentOrganizationId.value) {
      return;
    }

    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(
      getKeyForGetOrganization(currentOrganizationId.value)
    );
    // Clear the organizations list cache to ensure it refetches with updated data.
    store.setItems([]);
    // Also refresh the list of organizations in case the image is used there.
    await refreshNuxtData(getKeyForGetOrganizations());
  }

  /**
   * Refreshes the organization images data by invalidating the cache.
   * This function ensures that subsequent reads will fetch the updated data from the server, allowing the frontend application to reflect the changes made to the organization's images after any mutation operation.
   * By calling this function after mutations, it guarantees that the latest organization images data is available for components that rely on it, providing a consistent and up-to-date user experience.
   */
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

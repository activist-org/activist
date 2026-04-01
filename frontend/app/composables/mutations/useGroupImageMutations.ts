// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Composable for managing mutations related to group images in the frontend application. This composable provides functions to update existing images and upload new images for a group, as well as a function to refresh the group data after mutations. It handles loading and error states during the mutation process and integrates with the useToaster composable to display error messages to the user. The composable ensures that after any mutation, the group's data is refreshed by invalidating the cache, allowing subsequent reads to fetch the updated data from the server.
 * @param groupId A reactive reference containing the ID of the group for which the images are being managed, allowing the composable to reactively update its behavior based on changes to the group ID.
 * @returns An object containing the loading state, error state, functions for updating existing images and uploading new images, and a function for refreshing the group's data after mutations.
 */
export function useGroupImageMutations(groupId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));

  /**
   * Updates an existing image for the group based on the provided image data. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the group data after a successful update.
   * @param contentImage An object containing the updated image information. The function uses this data to perform the update operation and ensures that the group's data is refreshed afterward to reflect the changes.
   * @returns A boolean value indicating the success of the update operation, where true represents a successful update and false indicates a failure due to an error during the mutation process.
   */
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

      // Refresh the group data to get the new image.
      await refreshGroupData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Uploads new images for the group based on the provided image files and optional sequences. This function handles the mutation process, including setting the loading state, managing errors, and refreshing the group data after a successful upload.
   * @param images An array of objects containing the image files to be uploaded. The function uses this data to perform the upload operation and ensures that the group's data is refreshed afterward to reflect the changes.
   * @param sequences An optional array of numbers representing the order of the images. The function uses this data to set the order of the uploaded images.
   * @returns A boolean value indicating the success of the upload operation, where true represents a successful upload and false indicates a failure due to an error during the mutation process.
   */
  async function uploadImages(images: UploadableFile[], sequences?: number[]) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await uploadGroupImages(currentGroupId.value, images, sequences);

      // Invalidate cache and refetch fresh data.
      await refreshGroupData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Refreshes the group data by invalidating the useAsyncData cache for the current group. This function ensures that the latest data is fetched after any mutations, such as updating or uploading images.
   */
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

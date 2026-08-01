// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for group images - uses Pinia Colada for cache invalidation.

export function useGroupImageMutations(groupId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupImageCache } = useGroupCache();

  // Update existing image.
  const { mutateAsync: updateImage, isLoading: loadingUpdateImage } =
    useMutation({
      mutation: (contentImage: ContentImage) =>
        updateGroupImage(currentGroupId.value, contentImage),
      async onSettled() {
        await invalidateGroupImageCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Upload new images.
  const { mutateAsync: uploadImages, isLoading: loadingUploadImages } =
    useMutation({
      mutation: ({
        images,
        sequences,
      }: {
        images: UploadableFile[];
        sequences?: number[];
      }) => uploadGroupImages(currentGroupId.value, images, sequences),
      async onSettled() {
        await invalidateGroupImageCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete existing image.
  const { mutateAsync: deleteImageAsync, isLoading: loadingDeleteImage } =
    useMutation({
      mutation: (imageId: string) => deleteImage(imageId),
      async onSettled() {
        await invalidateGroupImageCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  watch(
    [loadingUpdateImage, loadingUploadImages, loadingDeleteImage],
    ([update, upload, del]) => {
      loading.value = update || upload || del;
    }
  );

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateImage,
    uploadImages,
    deleteImage: deleteImageAsync,
  };
}

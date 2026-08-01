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

  watch([loadingUpdateImage, loadingUploadImages], ([update, upload]) => {
    loading.value = update || upload;
  });

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateImage,
    uploadImages,
  };
}

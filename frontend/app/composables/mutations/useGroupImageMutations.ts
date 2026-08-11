// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for group images - uses Pinia Colada for cache invalidation.

export function useGroupImageMutations(
  groupId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupImageCache } = useGroupCache();

  // Update existing image.
  const {
    mutate: updateImage,
    mutateAsync: updateImageAsync,
    isLoading: loadingUpdateImage,
  } = useMutation({
    mutation: (contentImage: ContentImage) =>
      updateGroupImage(currentGroupId.value, contentImage),
    async onSuccess() {
      await invalidateGroupImageCache(currentGroupId.value);
      options.update?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.update,
  });

  // Upload new images.
  const {
    mutate: uploadImages,
    mutateAsync: uploadImagesAsync,
    isLoading: loadingUploadImages,
  } = useMutation({
    mutation: ({
      images,
      sequences,
    }: {
      images: UploadableFile[];
      sequences?: number[];
    }) => uploadGroupImages(currentGroupId.value, images, sequences),
    async onSuccess() {
      await invalidateGroupImageCache(currentGroupId.value);
      options.create?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.create,
  });

  // Delete existing image.
  const {
    mutate: deleteImg,
    mutateAsync: deleteImageAsync,
    isLoading: loadingDeleteImage,
  } = useMutation({
    mutation: (imageId: string) => deleteImage(imageId),
    async onSuccess() {
      await invalidateGroupImageCache(currentGroupId.value);
      options.delete?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.delete,
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
    deleteImage: deleteImg,
    updateImageAsync,
    uploadImagesAsync,
    deleteImageAsync,
  };
}

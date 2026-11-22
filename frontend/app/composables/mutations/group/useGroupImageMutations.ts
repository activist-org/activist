// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for group images - uses Pinia Colada for cache invalidation.

export function useGroupImageMutations(
  groupId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupImageCache } = useGroupCache();

  // Update existing image.
  const {
    mutate: updateImage,
    mutateAsync: updateImageAsync,
    isLoading: loadingUpdateImage,
  } = useCustomMutation(
    options.update,
    (contentImage: ContentImage) =>
      updateGroupImage(currentGroupId.value, contentImage),
    invalidateGroupImageCache,
    currentGroupId
  );


  // Upload new images.
  const {
    mutate: uploadImages,
    mutateAsync: uploadImagesAsync,
    isLoading: loadingUploadImages,
  } = useCustomMutation(
    options.create,
    ({
      images,
      sequences,
    }: {
      images: UploadableFile[];
      sequences?: number[];
    }) => uploadGroupImages(currentGroupId.value, images, sequences),
    invalidateGroupImageCache,
    currentGroupId
  );

  // Delete existing image.
  const {
    mutate: deleteImg,
    mutateAsync: deleteImageAsync,
    isLoading: loadingDeleteImage,
  } = useCustomMutation(
    options.delete,
    (imageId: string) => deleteImage(imageId),
    invalidateGroupImageCache,
    currentGroupId
  )
  

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
    deleteImage: deleteImg, // needed because of global fxn
    updateImageAsync,
    uploadImagesAsync,
    deleteImageAsync,
  };
}

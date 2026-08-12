// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for organization images - uses Pinia Colada for cache invalidation.

export function useOrganizationImageMutations(
  organizationId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentOrganizationId = computed(() => unref(organizationId));
  const { invalidateOrganizationCache, invalidateOrganizationImageCache } =
    useOrganizationCache();

  // Update existing image.
  const {
    mutate: updateImage,
    mutateAsync: updateImageAsync,
    isLoading: loadingUpdateImage,
  } = useMutation({
    ...options.update,
    mutation: (contentImage: ContentImage) =>
      updateOrganizationImage(currentOrganizationId.value, contentImage),
    async onSuccess() {
      await invalidateOrganizationImageCache(currentOrganizationId.value);
      options.update?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Upload new images.
  const {
    mutate: uploadImages,
    mutateAsync: uploadImagesAsync,
    isLoading: loadingUploadImages,
  } = useMutation({
    ...options.create,
    mutation: ({
      images,
      sequences,
    }: {
      images: UploadableFile[];
      sequences?: number[];
    }) =>
      uploadOrganizationImages(currentOrganizationId.value, images, sequences),
    async onSuccess() {
      await invalidateOrganizationImageCache(currentOrganizationId.value);
      options.create?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Delete existing image.
  const {
    mutate: deleteImg,
    mutateAsync: deleteImageAsync,
    isLoading: loadingDeleteImage,
  } = useMutation({
    ...options.delete,
    mutation: (imageId: string) => deleteImage(imageId),
    async onSuccess() {
      await invalidateOrganizationImageCache(currentOrganizationId.value);
      options.delete?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Upload new icon image.
  const { mutate: uploadIconImage, isLoading: loadingUploadIconImage } =
    useMutation({
      ...options.update,
      mutation: (image: UploadableFile) =>
        uploadOrganizationIconImage(currentOrganizationId.value, image),
      async onSuccess() {
        await invalidateOrganizationCache(currentOrganizationId.value);
        options.update?.onSuccess?.();
      },
      onError(err) {
        handleError(err);
      },
    });

  watch(
    [
      loadingUpdateImage,
      loadingUploadImages,
      loadingDeleteImage,
      loadingUploadIconImage,
    ],
    ([update, upload, del, uploadIcon]) => {
      loading.value = update || upload || del || uploadIcon;
    }
  );

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateImage,
    uploadImages,
    deleteImage: deleteImg,
    uploadIconImage,
    updateImageAsync,
    uploadImagesAsync,
    deleteImageAsync,
  };
}

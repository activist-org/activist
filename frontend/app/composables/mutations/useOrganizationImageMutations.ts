// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for organization images - uses Pinia Colada for cache invalidation.

export function useOrganizationImageMutations(
  organizationId: MaybeRef<string>
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentOrganizationId = computed(() => unref(organizationId));
  const store = useOrganizationListStore();
  const { invalidateOrganizationCache, invalidateOrganizationImageCache } =
    useOrganizationCache();

  // Update existing image.
  const { mutateAsync: updateImage, isLoading: loadingUpdateImage } =
    useMutation({
      mutation: (contentImage: ContentImage) =>
        updateOrganizationImage(currentOrganizationId.value, contentImage),
      async onSettled() {
        await invalidateOrganizationImageCache(currentOrganizationId.value);
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
      }) =>
        uploadOrganizationImages(
          currentOrganizationId.value,
          images,
          sequences
        ),
      async onSettled() {
        await invalidateOrganizationImageCache(currentOrganizationId.value);
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
        await invalidateOrganizationImageCache(currentOrganizationId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Upload new icon image.
  const { mutateAsync: uploadIconImage, isLoading: loadingUploadIconImage } =
    useMutation({
      mutation: (image: UploadableFile) =>
        uploadOrganizationIconImage(currentOrganizationId.value, image),
      async onSettled() {
        await invalidateOrganizationCache(currentOrganizationId.value);
        // Clear cached organizations to force refetch with new data.
        store.setItems([]);
        // The organizations list is still a useAsyncData read.
        await refreshNuxtData(getKeyForGetOrganizations());
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
    deleteImage: deleteImageAsync,
    uploadIconImage,
  };
}

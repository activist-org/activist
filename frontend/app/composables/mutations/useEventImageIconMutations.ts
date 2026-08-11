// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for event image icon.

export function useEventImageIconMutations(
  eventId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const { handleError } = useAppError();
  const loading = ref(false);
  const { invalidateEventCache } = useEventCache();
  const {
    mutate: uploadIconImage,
    isLoading: loadingUploadIconImage,
    error,
  } = useMutation({
    mutation: (image: UploadableFile) =>
      uploadEventIconImage(unref(eventId), image),
    async onSuccess() {
      await invalidateEventCache(unref(eventId));
      options.upload?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.upload,
  });

  watch(loadingUploadIconImage, (val) => {
    loading.value = val;
  });

  return {
    loading: readonly(loading),
    error,
    uploadIconImage,
  };
}

// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for event image icon

export function useEventImageIconMutations(eventId: MaybeRef<string>) {
  const { handleError } = useAppError();
  const loading = ref(false);
  const store = useEventListStore();
  const { invalidateEventCache } = useEventCache();
  const {
    mutate: mutateUploadIconImage,
    isLoading: loadingUploadIconImage,
    error,
  } = useMutation({
    mutation: (image: UploadableFile) =>
      uploadEventIconImage(unref(eventId), image),
    async onSettled() {
      await invalidateEventCache(unref(eventId));
      // Clear cached events to force refetch with new data.
      store.setItems([]);
    },
    onError(err) {
      handleError(err);
    },
  });

  watch(loadingUploadIconImage, (val) => {
    loading.value = val;
  });

  return {
    loading: readonly(loading),
    error,
    uploadIconImage: mutateUploadIconImage,
  };
}

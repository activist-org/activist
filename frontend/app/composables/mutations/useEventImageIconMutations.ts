// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.
import { useMutation, useQueryCache } from "@pinia/colada";

export function useEventImageIconMutations(eventId: MaybeRef<string>) {
  const queryCache = useQueryCache();
  const { handleError } = useAppError();
  const loading = ref(false);
  const store = useEventListStore();

  const {
    mutate: mutateUploadIconImage,
    isLoading: loadingUploadIconImage,
    error,
  } = useMutation({
    mutation: (image: UploadableFile) =>
      uploadEventIconImage(unref(eventId), image),
    async onSettled() {
      await queryCache.invalidateQueries({
        key: EVENT_KEYS.byId(unref(eventId)),
      });
      // Clear cached events to force refetch with new data.
      store.setItems([]);
    },
    onError(err) {
      handleError(err);
    },
  });
  const uploadIconImage = (image: UploadableFile) =>
    mutateUploadIconImage(image);

  watch(loadingUploadIconImage, (val) => {
    loading.value = val;
  });

  return {
    loading: readonly(loading),
    error,
    uploadIconImage,
  };
}

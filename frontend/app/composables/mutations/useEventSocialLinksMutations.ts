// SPDX-License-Identifier: AGPL-3.0-or-later
// Update event social links with error handling and store updates.

export function useEventSocialLinksMutations(
  eventId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentEventId = computed(() => unref(eventId));
  const { invalidateEventCache } = useEventCache();

  // Update a single social link.
  const {
    mutate: updateLink,
    mutateAsync: updateLinkAsync,
    isLoading: loadingUpdateLink,
  } = useMutation({
    mutation: async (linkData: {
      id: string;
      link: string;
      label: string;
      order: number;
    }) => {
      if (!currentEventId.value) return null;
      return updateEventSocialLink(currentEventId.value, linkData.id, linkData);
    },
    async onSuccess() {
      await invalidateEventCache(currentEventId.value);
    },
    onError(err) {
      handleError(err);
    },
    ...options.update,
  });

  // Create multiple social links.
  const {
    mutate: createLinks,
    mutateAsync: createLinksAsync,
    isLoading: loadingCreateLinks,
  } = useMutation({
    mutation: async (
      links: { link: string; label: string; order: number }[]
    ) => {
      if (!currentEventId.value) return null;
      if (!links || links.length === 0) return null; // Added defensive check
      return createEventSocialLinks(currentEventId.value, links);
    },
    async onSuccess() {
      await invalidateEventCache(currentEventId.value);
    },
    onError(err) {
      handleError(err);
    },
    ...options.create,
  });

  // Delete a single social link.
  const {
    mutate: deleteLink,
    mutateAsync: deleteLinkAsync,
    isLoading: loadingDeleteLink,
  } = useMutation({
    mutation: async (linkId: string) => {
      if (!currentEventId.value) return null;
      return deleteEventSocialLink(linkId);
    },
    async onSuccess() {
      await invalidateEventCache(currentEventId.value);
    },
    onError(err) {
      handleError(err);
    },
    ...options.delete,
  });

  // Replace all social links (delete all + create new ones).
  const {
    mutate: replaceAllLinks,
    mutateAsync: replaceAllLinksAsync,
    isLoading: loadingReplaceAllLinks,
  } = useMutation({
    mutation: async (
      links: { link: string; label: string; order: number }[]
    ) => {
      if (!currentEventId.value) return null;
      if (!links || links.length === 0) return null;
      return replaceAllEventSocialLinks(currentEventId.value, links);
    },
    async onSuccess() {
      await invalidateEventCache(currentEventId.value);
      options.reorder?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.reorder,
  });

  watch(
    [
      loadingUpdateLink,
      loadingCreateLinks,
      loadingDeleteLink,
      loadingReplaceAllLinks,
    ],
    ([update, create, del, replace]) => {
      loading.value = update || create || del || replace;
    }
  );

  return {
    loading: readonly(loading),
    error,
    updateLink,
    createLinks,
    deleteLink,
    replaceAllLinks,
    updateLinkAsync,
    createLinksAsync,
    deleteLinkAsync,
    replaceAllLinksAsync,
  };
}

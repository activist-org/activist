// SPDX-License-Identifier: AGPL-3.0-or-later
// Update event social links with error handling and store updates.

export function useEventSocialLinksMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentEventId = computed(() => unref(eventId));
  const { invalidateEventCache } = useEventCache();

  // Update a single social link.
  const { mutateAsync: updateLink, isLoading: loadingUpdateLink } = useMutation(
    {
      mutation: async (linkData: {
        id: string;
        link: string;
        label: string;
        order: number;
      }) => {
        if (!currentEventId.value) return null;
        return updateEventSocialLink(
          currentEventId.value,
          linkData.id,
          linkData
        );
      },
      async onSettled() {
        await invalidateEventCache(currentEventId.value);
      },
      onError(err) {
        handleError(err);
      },
    }
  );

  // Create multiple social links.
  const { mutateAsync: createLinks, isLoading: loadingCreateLinks } =
    useMutation({
      mutation: async (
        links: { link: string; label: string; order: number }[]
      ) => {
        if (!currentEventId.value) return null;
        if (!links || links.length === 0) return null; // Added defensive check
        return createEventSocialLinks(currentEventId.value, links);
      },
      async onSettled() {
        await invalidateEventCache(currentEventId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete a single social link.
  const { mutateAsync: deleteLink, isLoading: loadingDeleteLink } = useMutation(
    {
      mutation: async (linkId: string) => {
        if (!currentEventId.value) return null;
        return deleteEventSocialLink(linkId);
      },
      async onSettled() {
        await invalidateEventCache(currentEventId.value);
      },
      onError(err) {
        handleError(err);
      },
    }
  );

  // Replace all social links (delete all + create new ones).
  const { mutateAsync: replaceAllLinks, isLoading: loadingReplaceAllLinks } =
    useMutation({
      mutation: async (
        links: { link: string; label: string; order: number }[]
      ) => {
        if (!currentEventId.value) return null;
        if (!links || links.length === 0) return null;
        return replaceAllEventSocialLinks(currentEventId.value, links);
      },
      async onSettled() {
        await invalidateEventCache(currentEventId.value);
      },
      onError(err) {
        handleError(err);
      },
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
  };
}

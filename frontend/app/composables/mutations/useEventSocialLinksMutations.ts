// SPDX-License-Identifier: AGPL-3.0-or-later
// Update event social links with error handling and store updates.

export function useEventSocialLinksMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentEventId = computed(() => unref(eventId));
  const { invalidateEventCache } = useEventCache();
  // Update a single social link.
  const {
    mutate: updateLink,
    isLoading: loadingUpdateLink,
  } = useMutation({
    mutation: (linkData: { id: string; link: string; label: string; order: number }) =>
      updateEventSocialLink(currentEventId.value, linkData.id, linkData),
    async onSettled() {
      await invalidateEventCache(currentEventId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  // Create multiple social links.
  const {
    mutate: createLinks,
    isLoading: loadingCreateLinks,
  } = useMutation({
    mutation: (links: { link: string; label: string; order: number }[]) =>
      createEventSocialLinks(currentEventId.value, links),
    async onSettled() {
      await invalidateEventCache(currentEventId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  // Delete a single social link.
  const {
    mutate: deleteLink,
    isLoading: loadingDeleteLink,
  } = useMutation({
    mutation: (linkId: string) => deleteEventSocialLink(linkId),
    async onSettled() {
      await invalidateEventCache(currentEventId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  // Replace all social links (delete all + create new ones).
  const {
    mutate: replaceAllLinks,
    isLoading: loadingReplaceAllLinks,
  } = useMutation({
    mutation: (links: { link: string; label: string; order: number }[]) =>
      replaceAllEventSocialLinks(currentEventId.value, links),
    async onSettled() {
      await invalidateEventCache(currentEventId.value);
    },
    onError(err) {
        handleError(err);
    },
  });

  watch(
    [loadingUpdateLink, loadingCreateLinks, loadingDeleteLink, loadingReplaceAllLinks],
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

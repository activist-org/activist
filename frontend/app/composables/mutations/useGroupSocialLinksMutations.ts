// SPDX-License-Identifier: AGPL-3.0-or-later
// Update group social links with Pinia Colada for cache invalidation.

export function useGroupSocialLinksMutations(groupId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache } = useGroupCache();

  // Update a single social link.
  const { mutateAsync: updateLink, isLoading: loadingUpdateLink } = useMutation(
    {
      mutation: async (linkData: {
        id: string;
        link: string;
        label: string;
        order: number;
      }) => {
        if (!currentGroupId.value) return null;
        return updateGroupSocialLink(linkData.id, {
          link: linkData.link,
          label: linkData.label,
          order: linkData.order,
          group: currentGroupId.value,
        });
      },
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    }
  );

  // Create multiple social links.
  const { mutateAsync: createLinks, isLoading: loadingCreateLinks } =
    useMutation({
      mutation: async (links: SocialLinkInput[]) => {
        if (!currentGroupId.value || !links.length) return null;
        return createGroupSocialLinks(currentGroupId.value, links);
      },
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete a single social link.
  const { mutateAsync: deleteLink, isLoading: loadingDeleteLink } = useMutation(
    {
      mutation: (linkId: string) => deleteGroupSocialLink(linkId),
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
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
        if (!currentGroupId.value) return null;
        return replaceAllGroupSocialLinks(currentGroupId.value, links);
      },
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
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
    error: readonly(error),
    updateLink,
    createLinks,
    deleteLink,
    replaceAllLinks,
  };
}

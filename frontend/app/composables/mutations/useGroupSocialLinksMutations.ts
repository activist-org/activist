// SPDX-License-Identifier: AGPL-3.0-or-later
// Update group social links with Pinia Colada for cache invalidation.

export function useGroupSocialLinksMutations(groupId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache } = useGroupCache();

  // Update a single social link.
  const { mutateAsync: updateLinkAsync, isLoading: loadingUpdateLink } =
    useMutation({
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
      async onSettled() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Create multiple social links.
  const { mutateAsync: createLinksAsync, isLoading: loadingCreateLinks } =
    useMutation({
      mutation: async (links: SocialLinkInput[]) => {
        if (!currentGroupId.value || !links.length) return null;
        return createGroupSocialLinks(currentGroupId.value, links);
      },
      async onSettled() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete a single social link.
  const { mutateAsync: deleteLinkAsync, isLoading: loadingDeleteLink } =
    useMutation({
      mutation: (linkId: string) => deleteGroupSocialLink(linkId),
      async onSettled() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Replace all social links (delete all + create new ones).
  const {
    mutateAsync: replaceAllLinksAsync,
    isLoading: loadingReplaceAllLinks,
  } = useMutation({
    mutation: async (
      links: { link: string; label: string; order: number }[]
    ) => {
      if (!currentGroupId.value) return null;
      return replaceAllGroupSocialLinks(currentGroupId.value, links);
    },
    async onSettled() {
      await invalidateGroupCache(currentGroupId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  // Wrappers keep the true/false contract that call sites rely on.
  const updateLink = async (
    linkId: string,
    data: { link: string; label: string; order: number }
  ) => {
    if (!currentGroupId.value) return false;
    try {
      await updateLinkAsync({ id: linkId, ...data });
      return true;
    } catch {
      return false;
    }
  };

  const createLinks = async (links: SocialLinkInput[]) => {
    if (!currentGroupId.value || !links.length) return false;
    try {
      await createLinksAsync(links);
      return true;
    } catch {
      return false;
    }
  };

  const deleteLink = async (linkId: string) => {
    try {
      await deleteLinkAsync(linkId);
      return true;
    } catch {
      return false;
    }
  };

  const replaceAllLinks = async (
    links: { link: string; label: string; order: number }[]
  ) => {
    if (!currentGroupId.value) return false;
    try {
      await replaceAllLinksAsync(links);
      return true;
    } catch {
      return false;
    }
  };

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

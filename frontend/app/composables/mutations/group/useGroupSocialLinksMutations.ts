// SPDX-License-Identifier: AGPL-3.0-or-later
// Update group social links with Pinia Colada for cache invalidation.

export function useGroupSocialLinksMutations(
  groupId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache } = useGroupCache();

  // Update a single social link.
  const {
    mutate: updateLink,
    mutateAsync: updateLinkAsync,
    isLoading: loadingUpdateLink,
  } = useMutation({
    ...options.update,
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
      options.update?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Create multiple social links.
  const {
    mutate: createLinks,
    mutateAsync: createLinksAsync,
    isLoading: loadingCreateLinks,
  } = useMutation({
    ...options.create,
    mutation: async (links: SocialLinkInput[]) => {
      if (!currentGroupId.value || !links.length) return null;
      return createGroupSocialLinks(currentGroupId.value, links);
    },
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
      options.create?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Delete a single social link.
  const {
    mutate: deleteLink,
    mutateAsync: deleteLinkAsync,
    isLoading: loadingDeleteLink,
  } = useMutation({
    ...options.delete,
    mutation: (linkId: string) => deleteGroupSocialLink(linkId),
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
      options.delete?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
  });

  // Replace all social links (delete all + create new ones).
  const {
    mutate: replaceAllLinks,
    mutateAsync: replaceAllLinksAsync,
    isLoading: loadingReplaceAllLinks,
  } = useMutation({
    ...options.replaceAll,
    mutation: async (
      links: { link: string; label: string; order: number }[]
    ) => {
      if (!currentGroupId.value) return null;
      return replaceAllGroupSocialLinks(currentGroupId.value, links);
    },
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
      options.replaceAll?.onSuccess?.();
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
    updateLinkAsync,
    createLinksAsync,
    deleteLinkAsync,
    replaceAllLinksAsync,
  };
}

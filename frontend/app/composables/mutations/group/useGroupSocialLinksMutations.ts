// SPDX-License-Identifier: AGPL-3.0-or-later
// Update group social links with Pinia Colada for cache invalidation.

export function useGroupSocialLinksMutations(
  groupId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache } = useGroupCache();

  // Update a single social link.
  const {
    mutate: updateLink,
    mutateAsync: updateLinkAsync,
    isLoading: loadingUpdateLink,
  } = useCustomMutation(
    options.mutate,
    async (linkData: {
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
    invalidateGroupCache,
    currentGroupId
  );

  // Create multiple social links.
  const {
    mutate: createLinks,
    mutateAsync: createLinksAsync,
    isLoading: loadingCreateLinks,
  } = useCustomMutation(
    options.create,
    async (links: SocialLinkInput[]) => {
      if (!currentGroupId.value || !links.length) return null;
      return createGroupSocialLinks(currentGroupId.value, links);
    },
    invalidateGroupCache,
    currentGroupId
  );

  // Delete a single social link.
  const {
    mutate: deleteLink,
    mutateAsync: deleteLinkAsync,
    isLoading: loadingDeleteLink,
  } = useCustomMutation(
    options.delete,
    (linkId: string) => deleteGroupSocialLink(linkId),
    invalidateGroupCache,
    currentGroupId
  );

  // Replace all social links (delete all + create new ones).
  const {
    mutate: replaceAllLinks,
    mutateAsync: replaceAllLinksAsync,
    isLoading: loadingReplaceAllLinks,
  } = useCustomMutation(
    options.replaceAll,
    async (links: { link: string; label: string; order: number }[]) => {
      if (!currentGroupId.value) return null;
      return replaceAllGroupSocialLinks(currentGroupId.value, links);
    },
    invalidateGroupCache,
    currentGroupId
  );

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

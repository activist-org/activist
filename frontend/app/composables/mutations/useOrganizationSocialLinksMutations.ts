// SPDX-License-Identifier: AGPL-3.0-or-later
// Update organization social links with Pinia Colada for cache invalidation.

export function useOrganizationSocialLinksMutations(
  organizationId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentOrganizationId = computed(() => unref(organizationId));
  const { invalidateOrganizationCache } = useOrganizationCache();

  // Update a single social link.
  const {
    mutate: updateLink,
    isLoading: loadingUpdateLink,
    mutateAsync: updateLinkAsync,
  } = useMutation({
    mutation: async (linkData: {
      id: string;
      link: string;
      label: string;
      order: number;
    }) => {
      if (!currentOrganizationId.value) return null;
      return updateOrganizationSocialLink(
        currentOrganizationId.value,
        linkData.id,
        linkData
      );
    },
    async onSuccess() {
      await invalidateOrganizationCache(currentOrganizationId.value);
      options.update?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.update,
  });

  // Create multiple social links.
  const {
    mutate: createLinks,
    isLoading: loadingCreateLinks,
    mutateAsync: createLinksAsync,
  } = useMutation({
    mutation: async (links: SocialLinkInput[]) => {
      if (!currentOrganizationId.value || !links.length) return null;
      return createOrganizationSocialLinks(currentOrganizationId.value, links);
    },
    async onSuccess() {
      await invalidateOrganizationCache(currentOrganizationId.value);
      options.create?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.create,
  });

  // Delete a single social link.
  const {
    mutate: deleteLink,
    isLoading: loadingDeleteLink,
    mutateAsync: deleteLinkAsync,
  } = useMutation({
    mutation: (linkId: string) => deleteOrganizationSocialLink(linkId),
    async onSuccess() {
      await invalidateOrganizationCache(currentOrganizationId.value);
      options.delete?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.delete,
  });

  // Replace all social links (delete all + create new ones).
  const {
    mutate: replaceAllLinks,
    isLoading: loadingReplaceAllLinks,
    mutateAsync: replaceAllLinksAsync,
  } = useMutation({
    mutation: async (
      links: { link: string; label: string; order: number }[]
    ) => {
      if (!currentOrganizationId.value) return null;
      return replaceAllOrganizationSocialLinks(
        currentOrganizationId.value,
        links
      );
    },
    async onSuccess() {
      await invalidateOrganizationCache(currentOrganizationId.value);
      options.replaceAll?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.replaceAll,
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

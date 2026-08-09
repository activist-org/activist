// SPDX-License-Identifier: AGPL-3.0-or-later
// Update organization social links with Pinia Colada for cache invalidation.

export function useOrganizationSocialLinksMutations(
  organizationId: MaybeRef<string>
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentOrganizationId = computed(() => unref(organizationId));
  const { invalidateOrganizationCache } = useOrganizationCache();

  // Update a single social link.
  const { mutateAsync: updateLinkAsync, isLoading: loadingUpdateLink } =
    useMutation({
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
      async onSettled() {
        await invalidateOrganizationCache(currentOrganizationId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Create multiple social links.
  const { mutateAsync: createLinksAsync, isLoading: loadingCreateLinks } =
    useMutation({
      mutation: async (links: SocialLinkInput[]) => {
        if (!currentOrganizationId.value || !links.length) return null;
        return createOrganizationSocialLinks(
          currentOrganizationId.value,
          links
        );
      },
      async onSettled() {
        await invalidateOrganizationCache(currentOrganizationId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete a single social link.
  const { mutateAsync: deleteLinkAsync, isLoading: loadingDeleteLink } =
    useMutation({
      mutation: (linkId: string) => deleteOrganizationSocialLink(linkId),
      async onSettled() {
        await invalidateOrganizationCache(currentOrganizationId.value);
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
      if (!currentOrganizationId.value) return null;
      return replaceAllOrganizationSocialLinks(
        currentOrganizationId.value,
        links
      );
    },
    async onSettled() {
      await invalidateOrganizationCache(currentOrganizationId.value);
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
    if (!currentOrganizationId.value) return false;
    try {
      await updateLinkAsync({ id: linkId, ...data });
      return true;
    } catch {
      return false;
    }
  };

  const createLinks = async (links: SocialLinkInput[]) => {
    if (!currentOrganizationId.value || !links.length) return false;
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
    if (!currentOrganizationId.value) return false;
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

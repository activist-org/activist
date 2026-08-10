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
  const { mutateAsync: updateLink, isLoading: loadingUpdateLink } = useMutation(
    {
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
        if (!currentOrganizationId.value || !links.length) return null;
        return createOrganizationSocialLinks(
          currentOrganizationId.value,
          links
        );
      },
      async onSuccess() {
        await invalidateOrganizationCache(currentOrganizationId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete a single social link.
  const { mutateAsync: deleteLink, isLoading: loadingDeleteLink } = useMutation(
    {
      mutation: (linkId: string) => deleteOrganizationSocialLink(linkId),
      async onSuccess() {
        await invalidateOrganizationCache(currentOrganizationId.value);
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
        if (!currentOrganizationId.value) return null;
        return replaceAllOrganizationSocialLinks(
          currentOrganizationId.value,
          links
        );
      },
      async onSuccess() {
        await invalidateOrganizationCache(currentOrganizationId.value);
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

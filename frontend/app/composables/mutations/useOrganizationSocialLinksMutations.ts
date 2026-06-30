// SPDX-License-Identifier: AGPL-3.0-or-later
// Update organization social links with error handling and store updates.

export function useOrganizationSocialLinksMutations(
  organizationId: MaybeRef<string>
) {
  const { showToastError } = useToaster();
  // Captured at setup; useNuxtApp() would fail inside the deferred callback.
  const nuxtApp = useNuxtApp();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentOrganizationId = computed(() => unref(organizationId));

  // Update a single social link.
  async function updateLink(
    linkId: string,
    data: { link: string; label: string; order: number }
  ) {
    if (!currentOrganizationId.value) {
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      await updateOrganizationSocialLink(currentOrganizationId.value, linkId, {
        ...data,
      });

      scheduleOrganizationRefresh();

      return true;
    } catch (err) {
      const appError = err as AppError;
      error.value = appError;
      showToastError(appError.message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Create multiple social links.
  async function createLinks(links: SocialLinkInput[]) {
    if (!currentOrganizationId.value || !links.length) {
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      await createOrganizationSocialLinks(currentOrganizationId.value, links);

      scheduleOrganizationRefresh();

      return true;
    } catch (err) {
      const appError = errorHandler(err);
      error.value = appError;
      showToastError(appError.message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Delete a single social link.
  async function deleteLink(linkId: string) {
    loading.value = true;
    error.value = null;

    try {
      await deleteOrganizationSocialLink(linkId);

      scheduleOrganizationRefresh();

      return true;
    } catch (err) {
      const appError = errorHandler(err);
      error.value = appError;
      showToastError(appError.message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Replace all social links (delete all + create new ones).
  async function replaceAllLinks(
    links: { link: string; label: string; order: number }[]
  ) {
    if (!currentOrganizationId.value) {
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      await replaceAllOrganizationSocialLinks(
        currentOrganizationId.value,
        links
      );

      scheduleOrganizationRefresh();

      return true;
    } catch (err) {
      const appError = errorHandler(err);
      error.value = appError;
      showToastError(appError.message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Defer to a macrotask so the modal closes before the refresh runs.
  function scheduleOrganizationRefresh() {
    setTimeout(
      () => void nuxtApp.runWithContext(() => refreshOrganizationData()),
      0
    );
  }

  // Helper to refresh organization data after mutations.
  async function refreshOrganizationData() {
    if (!currentOrganizationId.value) {
      return;
    }

    // Clear first: with dedupe "defer" a bare refreshNuxtData can be dropped on
    // collision, leaving the list stale (e.g. a deleted entry lingering).
    const key = getKeyForGetOrganization(currentOrganizationId.value);
    clearNuxtData(key);
    await refreshNuxtData(key);
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateLink,
    createLinks,
    deleteLink,
    replaceAllLinks,
    refreshOrganizationData,
  };
}

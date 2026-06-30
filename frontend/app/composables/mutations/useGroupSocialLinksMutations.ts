// SPDX-License-Identifier: AGPL-3.0-or-later
// Update group social links with error handling and store updates.

export function useGroupSocialLinksMutations(groupId: MaybeRef<string>) {
  const { error, handleError, clearError } = useAppError();
  // Captured at setup; useNuxtApp() would fail inside the deferred callback.
  const nuxtApp = useNuxtApp();

  const loading = ref(false);

  const currentGroupId = computed(() => unref(groupId));

  // Update a single social link.
  async function updateLink(
    linkId: string,
    data: { link: string; label: string; order: number }
  ) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      await updateGroupSocialLink(linkId, {
        ...data,
        group: currentGroupId.value,
      });

      scheduleGroupRefresh();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Create multiple social links.
  async function createLinks(links: SocialLinkInput[]) {
    if (!currentGroupId.value || !links.length) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      await createGroupSocialLinks(currentGroupId.value, links);

      scheduleGroupRefresh();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Delete a single social link.
  async function deleteLink(linkId: string) {
    loading.value = true;
    clearError();

    try {
      await deleteGroupSocialLink(linkId);

      scheduleGroupRefresh();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Replace all social links (delete all + create new ones).
  async function replaceAllLinks(
    links: { link: string; label: string; order: number }[]
  ) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      await replaceAllGroupSocialLinks(currentGroupId.value, links);

      scheduleGroupRefresh();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Defer to a macrotask so the modal closes before the refresh runs.
  function scheduleGroupRefresh() {
    setTimeout(() => void nuxtApp.runWithContext(() => refreshGroupData()), 0);
  }

  // Helper to refresh group data after mutations.
  async function refreshGroupData() {
    if (!currentGroupId.value) {
      return;
    }

    // Clear first: with dedupe "defer" a bare refreshNuxtData can be dropped on
    // collision, leaving the list stale (e.g. a deleted entry lingering).
    const key = getKeyForGetGroup(currentGroupId.value);
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
    refreshGroupData,
  };
}

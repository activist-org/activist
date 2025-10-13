// SPDX-License-Identifier: AGPL-3.0-or-later
// Update group social links with error handling and store updates

import type { MaybeRef } from "vue";

import type { SocialLinkFormData } from "~/types/content/social-link";

import {
  updateGroupSocialLink,
  createGroupSocialLinks,
  deleteGroupSocialLink,
  replaceAllGroupSocialLinks,
} from "~/services/group";
import { errorHandler } from "~/utils/errorHandler";

export function useUpdateSocialLinks(groupId: MaybeRef<string>) {
  const { showToastError, showToastSuccess } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentGroupId = computed(() => unref(groupId));

  // Update a single social link
  async function updateLink(
    linkId: string,
    data: { link: string; label: string; order: number }
  ) {
    if (!currentGroupId.value) return false;

    loading.value = true;
    error.value = null;

    try {
      await updateGroupSocialLink(linkId, {
        ...data,
        group: currentGroupId.value,
      });

      showToastSuccess("Social link updated successfully");

      // Refresh the group data to get updated links
      await refreshGroupData();

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

  // Create multiple social links
  async function createLinks(links: SocialLinkFormData[]) {
    if (!currentGroupId.value || !links.length) return false;

    loading.value = true;
    error.value = null;

    try {
      await createGroupSocialLinks(currentGroupId.value, links);

      showToastSuccess(`${links.length} social link(s) added successfully`);

      // Refresh the group data to get updated links
      await refreshGroupData();

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

  // Delete a single social link
  async function deleteLink(linkId: string) {
    loading.value = true;
    error.value = null;

    try {
      await deleteGroupSocialLink(linkId);

      showToastSuccess("Social link deleted successfully");

      // Refresh the group data to get updated links
      await refreshGroupData();

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

  // Replace all social links (delete all + create new ones)
  async function replaceAllLinks(
    links: { link: string; label: string; order: number }[]
  ) {
    if (!currentGroupId.value) return false;

    loading.value = true;
    error.value = null;

    try {
      await replaceAllGroupSocialLinks(currentGroupId.value, links);

      showToastSuccess("Social links updated successfully");

      // Refresh the group data to get updated links
      await refreshGroupData();

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

  // Helper to refresh group data after mutations
  async function refreshGroupData() {
    if (!currentGroupId.value) return;

    // Refresh the useAsyncData cache
    await refreshNuxtData(`group:${currentGroupId.value}`);
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

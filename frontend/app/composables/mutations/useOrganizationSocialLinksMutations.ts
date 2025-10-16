// SPDX-License-Identifier: AGPL-3.0-or-later
// Update organization social links with error handling and store updates

import type { MaybeRef } from "vue";

import type { SocialLinkFormData } from "~/types/content/social-link";
import type { AppError } from "~/utils/errorHandler";

import {
  createOrganizationSocialLinks,
  deleteOrganizationSocialLink,
  replaceAllOrganizationSocialLinks,
  updateOrganizationSocialLink,
} from "~/services/communities/organization/social-link";

import { getKeyForGetOrganization } from "../queries/useGetOrganization";

export function useOrganizationSocialLinksMutations(
  organizationId: MaybeRef<string>
) {
  const { showToastError } = useToaster();

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

      // Refresh the organization data to get updated links.
      await refreshOrganizationData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Create multiple social links.
  async function createLinks(links: SocialLinkFormData[]) {
    if (!currentOrganizationId.value || !links.length) {
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      await createOrganizationSocialLinks(currentOrganizationId.value, links);

      // Refresh the organization data to get updated links.
      await refreshOrganizationData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
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

      // Refresh the organization data to get updated links.
      await refreshOrganizationData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
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

      // Refresh the organization data to get updated links.
      await refreshOrganizationData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Helper to refresh organization data after mutations.
  async function refreshOrganizationData() {
    if (!currentOrganizationId.value) {
      return;
    }

    // Refresh the useAsyncData cache.
    await refreshNuxtData(
      getKeyForGetOrganization(currentOrganizationId.value)
    );
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

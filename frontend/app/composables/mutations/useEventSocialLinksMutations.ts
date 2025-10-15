// SPDX-License-Identifier: AGPL-3.0-or-later
// Update event social links with error handling and store updates

import type { MaybeRef } from "vue";

import type { SocialLinkFormData } from "~/types/content/social-link";
import type { AppError } from "~/utils/errorHandler";

import {
  updateEventSocialLink,
  createEventSocialLinks,
  deleteEventSocialLink,
  replaceAllEventSocialLinks,
} from "~/services/event/social-link";

export function useEventSocialLinksMutations(eventId: MaybeRef<string>) {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentEventId = computed(() => unref(eventId));

  // Update a single social link
  async function updateLink(
    linkId: string,
    data: { link: string; label: string; order: number }
  ) {
    if (!currentEventId.value) return false;

    loading.value = true;
    error.value = null;

    try {
      await updateEventSocialLink(currentEventId.value, linkId, {
        ...data,
      });

      // Refresh the event data to get updated links
      await refreshEventData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Create multiple social links
  async function createLinks(links: SocialLinkFormData[]) {
    if (!currentEventId.value || !links.length) return false;

    loading.value = true;
    error.value = null;

    try {
      await createEventSocialLinks(currentEventId.value, links);

      // Refresh the event data to get updated links
      await refreshEventData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
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
      await deleteEventSocialLink(linkId);

      // Refresh the event data to get updated links
      await refreshEventData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Replace all social links (delete all + create new ones)
  async function replaceAllLinks(
    links: { link: string; label: string; order: number }[]
  ) {
    if (!currentEventId.value) return false;

    loading.value = true;
    error.value = null;

    try {
      await replaceAllEventSocialLinks(currentEventId.value, links);

      // Refresh the event data to get updated links
      await refreshEventData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Helper to refresh event data after mutations
  async function refreshEventData() {
    if (!currentEventId.value) return;

    // Refresh the useAsyncData cache
    await refreshNuxtData(`event:${currentEventId.value}`);
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateLink,
    createLinks,
    deleteLink,
    replaceAllLinks,
    refreshEventData,
  };
}

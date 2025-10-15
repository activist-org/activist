// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a single images organization with useAsyncData. Store-first, then fetch if missing.
// After fetch, cache it via store. You can always call refresh() to force refetch.

import type { MaybeRef } from "vue";

import type { ContentImage } from "~/types/content/file";
import type { AppError } from "~/utils/errorHandler";

import { fetchGroupImages } from "~/services/communities/group/image";
import { useOrganizationStore } from "~/stores/organization";

export function useGetOrganizationImages(id: MaybeRef<string>) {
  const { showToastError } = useToaster();
  const organizationId = computed(() => String(unref(id)));
  const store = useOrganizationStore();
  // Cache key for useAsyncData.
  const key = computed(() =>
    organizationId.value ? `organizationImages:${organizationId.value}` : null
  );

  // Check if we have cached data.
  const cached = computed<ContentImage[]>(() => store.getImages());

  // Only fetch if we have an ID and no cached data.
  const shouldFetch = computed(
    () => !!organizationId.value && cached.value.length === 0
  );

  const query = useAsyncData(
    `organizationImages:${organizationId.value}`,
    async () => {
      if (!organizationId.value) {
        return null;
      }

      try {
        const images = await fetchGroupImages(organizationId.value);
        // Cache the result in store.
        store.setImages(images);
        return images;
      } catch (error) {
        showToastError((error as AppError).message);
        throw error;
      }
    },
    {
      watch: [organizationId],
      immediate: shouldFetch.value,
      dedupe: "defer",
      // Don't execute on server if we already have cached data.
      server: shouldFetch.value,
    }
  );

  // Return cached data if available, otherwise data from useAsyncData.
  const data = computed<ContentImage[]>(() =>
    cached.value && cached.value.length > 0
      ? cached.value
      : (query.data.value as ContentImage[]) || []
  );
  // Only show pending when we're actually fetching (not when using cache).
  const pending = computed(() =>
    shouldFetch.value ? query.pending.value : false
  );

  async function refresh() {
    if (!key.value) {
      return;
    }
    // Clear cache first to force refetch.
    if (organizationId.value) {
      store.clearImages();
    }
    // Let useAsyncData refetch and update store in the success path above.
    await refreshNuxtData(key.value);
  }

  return {
    data,
    pending,
    error: query.error,
    refresh,
  };
}

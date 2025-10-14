// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a single group with useAsyncData. Store-first, then fetch if missing.
// After fetch, cache it via store. You can always call refresh() to force refetch.

import type { MaybeRef } from "vue";

import type { Group } from "~/types/communities/group";
import type { AppError } from "~/utils/errorHandler";

import { getGroup } from "~/services/communities/group/group";
import { useGroupStore } from "~/stores/group";

export function useGetGroup(id: MaybeRef<string>) {
  const { showToastError } = useToaster();
  const groupId = computed(() => String(unref(id)));
  const store = useGroupStore();

  // Cache key for useAsyncData.
  const key = computed(() => (groupId.value ? `group:${groupId.value}` : null));

  // Check if we have cached data.
  const cached = computed<Group | null>(() =>
    store.getGroup() && store.getGroup().id !== "" ? store.getGroup() : null
  );

  // Only fetch if we have an ID and no cached data.
  const shouldFetch = computed(() => !!groupId.value && !cached.value);

  const query = useAsyncData(
    `group:${groupId.value}`,
    async () => {
      if (!groupId.value) {
        return null;
      }

      try {
        const group = await getGroup(groupId.value);
        // Cache the result in store.
        store.setGroup(group);
        return group as Group;
      } catch (error) {
        showToastError((error as AppError).message);
        throw error;
      }
    },
    {
      watch: [groupId],
      immediate: shouldFetch.value,
      dedupe: "defer",
      // Don't execute on server if we already have cached data.
      server: shouldFetch.value,
    }
  );

  // Return cached data if available, otherwise data from useAsyncData.
  const data = computed<Group | null>(() =>
    cached.value && cached.value.id !== ""
      ? cached.value
      : (query.data.value as Group | null)
  );

  // Only show pending when we're actually fetching (not when using cache).
  const pending = computed(() =>
    shouldFetch.value ? query.pending.value : false
  );

  async function refresh() {
    if (!key.value) {
      return;
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

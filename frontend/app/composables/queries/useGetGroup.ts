// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a single group with useAsyncData. Store-first, then fetch if missing.
// After fetch, cache it via store. You can always call refresh() to force refetch.

import type { MaybeRef } from "vue";

import type { Group } from "~/types/communities/group";
import type { AppError } from "~/utils/errorHandler";

import { getGroup } from "~/services/communities/group/group";
import { useGroupStore } from "~/stores/group";

export const getKeyForGetGroup = (id: string) => `group:${id}`;

export function useGetGroup(id: MaybeRef<string>) {
  const { showToastError } = useToaster();
  const groupId = computed(() => String(unref(id)));
  const store = useGroupStore();

  // Cache key for useAsyncData.
  const key = computed(() =>
    groupId.value ? getKeyForGetGroup(groupId.value) : null
  );

  const query = useAsyncData(
    getKeyForGetGroup(groupId.value),
    async () => {
      if (!groupId.value || groupId.value === "") {
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
      immediate: true,
      dedupe: "defer",
      getCachedData: (key, nuxtApp) => {
        if (
          nuxtApp.isHydrating &&
          store.getGroup() &&
          store.getGroup().id !== "" &&
          store.getGroup().id === groupId.value
        ) {
          return store.getGroup();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      },
    }
  );

  // Data from useAsyncData.
  const data = computed<Group | null>(() => query.data.value as Group | null);

  // Only show pending when we're actually fetching (not when using cache).
  const pending = computed(() => query.pending.value);

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

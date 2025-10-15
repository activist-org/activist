// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a single event with useAsyncData. Store-first, then fetch if missing.
// After fetch, cache it via store. You can always call refresh() to force refetch.

import type { MaybeRef } from "vue";

import type { Organization } from "~/types/communities/organization";
import type { AppError } from "~/utils/errorHandler";

import { getOrganization } from "~/services/communities/organization/organization";
import { useOrganizationStore } from "~/stores/organization";

export function useGetOrganization(id: MaybeRef<string>) {
  const { showToastError } = useToaster();
  const organizationId = computed(() => String(unref(id)));
  const store = useOrganizationStore();

  // Cache key for useAsyncData
  const key = computed(() =>
    organizationId.value ? `organization:${organizationId.value}` : null
  );

  // Check if we have cached data
  const cached = computed<Organization | null>(() =>
    store.getOrganization() &&
    store.getOrganization().id !== "" &&
    store.getOrganization().id === organizationId.value
      ? store.getOrganization()
      : null
  );

  // Only fetch if we have an ID and no cached data
  const shouldFetch = computed(() => !!organizationId.value && !cached.value);

  const query = useAsyncData(
    `organization:${organizationId.value}`,
    async () => {
      if (!organizationId.value && organizationId.value === "") return null;

      try {
        const organization = await getOrganization(organizationId.value);
        // Cache the result in store
        store.setOrganization(organization);
        return organization;
      } catch (error) {
        showToastError((error as AppError).message);
        throw error;
      }
    },
    {
      watch: [organizationId],
      immediate: shouldFetch.value,
      dedupe: "defer",
      // Don't execute on server if we already have cached data
      server: shouldFetch.value,
    }
  );

  // Return cached data if available, otherwise data from useAsyncData
  const data = computed<Organization | null>(() =>
    cached.value && cached.value.id !== ""
      ? cached.value
      : (query.data.value as Organization | null)
  );

  // Only show pending when we're actually fetching (not when using cache)
  const pending = computed(() =>
    shouldFetch.value ? query.pending.value : false
  );

  async function refresh() {
    if (!key.value) return;
    // Let useAsyncData refetch and update store in the success path above
    await refreshNuxtData(key.value);
  }

  return {
    data,
    pending,
    error: query.error,
    refresh,
  };
}

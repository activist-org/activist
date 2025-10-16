// SPDX-License-Identifier: AGPL-3.0-or-later
import type {
  Organization as OrganizationT,
  OrganizationFilters,
} from "~/types/communities/organization";

import { useToaster } from "~/composables/useToaster";
import { listOrganizations } from "~/services/communities/organization/organization";

export const getKeyForGetOrganizations = (filters: OrganizationFilters) =>
  `organizations-list:${JSON.stringify(filters)}`;

export function useGetOrganizations(
  filters: Ref<OrganizationFilters> | ComputedRef<OrganizationFilters>
) {
  const store = useOrganizationStore();
  const { showToastError } = useToaster();

  // Use AsyncData for SSR, hydration, and cache
  const { data, pending, error, refresh } = useAsyncData<OrganizationT[]>(
    () => getKeyForGetOrganizations(unref(filters)),
    async () => {
      try {
        const organizations = await listOrganizations(unref(filters));
        store.setOrganizations(organizations);
        return organizations as OrganizationT[];
      } catch (error) {
        showToastError((error as AppError).message);
        throw error;
      }
    },
    {
      watch: [filters],
      immediate: true,
      default: () => [],
      getCachedData: (key, nuxtApp) => {
        if (store.getOrganizations().length > 0) {
          return store.getOrganizations();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      },
    }
  );

  return {
    data,
    pending,
    error,
    refresh,
    filters,
  };
}

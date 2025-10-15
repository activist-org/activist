// SPDX-License-Identifier: AGPL-3.0-or-later
import type {
  Organization as OrganizationT,
  OrganizationFilters,
} from "~/types/communities/organization";

import { useToaster } from "~/composables/useToaster";
import { listOrganizations } from "~/services/communities/organization/organization";

export function useGetOrganizations(
  filters: Ref<OrganizationFilters> | ComputedRef<OrganizationFilters>
) {
  const store = useOrganizationStore();
  const { showToastError } = useToaster();

  // UseAsyncData for SSR, hydration, and cache
  const { data, pending, error, refresh } = useAsyncData<OrganizationT[]>(
    () => `organizations-list:${JSON.stringify(unref(filters))}`,
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
      server: false,
      lazy: true,
      default: () => [],
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

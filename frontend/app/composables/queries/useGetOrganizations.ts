// SPDX-License-Identifier: AGPL-3.0-or-later
import { computed, unref, watch, ref } from "vue";
import { useQuery } from "@pinia/colada";

export function useGetOrganizations(
  filters: MaybeRef<OrganizationFilters> | ComputedRef<OrganizationFilters>
) {
  const store = useOrganizationListStore();
  const { handleError, error: appError } = useAppError();
  const { getKeyForGetOrganizations } = useOrganizationCache();

  const orgFilters = computed(() => unref(filters));

  const isSameFilters = computed(
    () => JSON.stringify(store.getFilters()) === JSON.stringify(orgFilters.value)
  );

  const page = ref(isSameFilters.value ? store.getPage() : 1);

  const { data, isLoading, error, refetch } = useQuery({
    key: () => getKeyForGetOrganizations(orgFilters.value),
    query: async () => {
      if (!isSameFilters.value) {
        page.value = 1;
        store.clear();
      }

      const targetPage = page.value;

      const { data: organizations, isLastPage } = await listOrganizations({
        ...orgFilters.value,
        page: targetPage,
        page_size: 10,
      });

      store.setIsLastPage(isLastPage);
      store.setPage(targetPage);
      store.setFilters(orgFilters.value);

      const organizationsCached = store.getItems();

      // Append new items if fetching page > 1 with the same filters
      if (targetPage > 1 && isSameFilters.value) {
        const combinedOrganizations = [...organizationsCached, ...organizations];
        store.setItems(combinedOrganizations);
        return combinedOrganizations;
      }

      // For page 1, strictly replace the items
      store.setItems(organizations);
      return organizations;
    },
  });

  watch(error, (err) => {
    if (err) {
      handleError(err);
    }
  });

  watch(
    orgFilters,
    (newFilters, oldFilters) => {
      if (JSON.stringify(newFilters) !== JSON.stringify(oldFilters)) {
        page.value = 1;
      }
    },
    { deep: true }
  );

  const refreshList = async () => {
    page.value = 1;
    await refetch();
  };

  const getMore = async () => {
    if (store.getIsLastPage() || isLoading.value) return;
    page.value += 1;
    await refetch();
  };

  return {
    data,
    pending: isLoading,
    error: appError,
    refresh: refreshList,
    filters: orgFilters.value,
    getMore,
  };
}

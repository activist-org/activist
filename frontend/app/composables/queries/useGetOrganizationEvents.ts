// SPDX-License-Identifier: AGPL-3.0-or-later
// Get organization events with useAsyncData. Store-first, then fetch if missing.
// After fetch, cache it via store. You can always call refresh() to force refetch.

export const getKeyForGetOrganizationEvents = (
  id: string,
  filters?: Record<string, unknown>
) => `organizationEvents:${id}:${JSON.stringify(filters)}`;

export function useGetOrganizationEvents(
  id: MaybeRef<string>,
  filters?: MaybeRef<{
    startDate?: string;
    endDate?: string;
    name?: string;
  }>
) {
  const { handleError } = useAppError();
  const organizationId = computed(() => String(unref(id)));
  const filtersRef = computed(() => unref(filters) ?? {});
  const store = useOrganizationEventStore();
  const key = computed(() =>
    organizationId.value
      ? getKeyForGetOrganizationEvents(organizationId.value, filtersRef.value)
      : null
  );
  watch(
    filtersRef,
    (newFilters) => {
      console.log("Filters updated:", newFilters);
    },
    { deep: true, immediate: true }
  );
  // Cache key for useAsyncData.
  const cached = computed(
    () =>
      store.getEvents().length > 0 &&
      organizationId.value === store.getEntityId() &&
      JSON.stringify(filtersRef.value) === JSON.stringify(store.getFilters())
  );

  // Only fetch if we have an ID and no cached data.
  const shouldFetch = computed(() => !!organizationId.value && !cached.value);

  const query = useAsyncData(
    () => getKeyForGetOrganizationEvents(organizationId.value, filtersRef.value),
    async () => {
      console.log("Fetching organization events with filters:", filtersRef.value);
      if (!organizationId.value) {
        return null;
      }

      try {
        console.log(
          "Fetching organization events with filters:",
          filtersRef.value
        );
        const events = await fetchOrganizationEvents(
          organizationId.value,
          filtersRef.value
        );

        // Cache the result in store.
        store.setEvents(events);
        store.setEntityId(organizationId.value);
        store.setFilters(filtersRef.value);
        return events;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    {
      watch: [organizationId, filtersRef],
      default: () => (cached.value ? store.getEvents() : []),
      immediate: true,
      getCachedData: (key, nuxtApp) => {
        console.log(
          nuxtApp.isHydrating &&
            store.getEvents().length > 0 &&
            organizationId.value === store.getEntityId() &&
            JSON.stringify(filtersRef.value) ===
              JSON.stringify(store.getFilters())
        );
        if (
          nuxtApp.isHydrating &&
          store.getEvents().length > 0 &&
          organizationId.value === store.getEntityId() &&
          JSON.stringify(filtersRef.value) ===
            JSON.stringify(store.getFilters())
        ) {
          return store.getEvents();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      },
    }
  );

  // Return cached data if available, otherwise data from useAsyncData.
  const data = computed<CommunityEvent[]>(
    () => (query.data.value as CommunityEvent[]) || []
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
      store.clearEvents();
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

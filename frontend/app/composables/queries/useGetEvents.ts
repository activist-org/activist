// SPDX-License-Identifier: AGPL-3.0-or-later
import type { EventFilters, Event as EventT } from "~/types/events/event";

import { useToaster } from "~/composables/useToaster";
import { listEvents } from "~/services/event/event";
import { useEventStore } from "~/stores/event";

export const getKeyForGetEvents = (filters: EventFilters) =>
  `events-list:${JSON.stringify(filters)}`;

export function useGetEvents(
  filters: Ref<EventFilters> | ComputedRef<EventFilters>
) {
  const store = useEventStore();
  const { showToastError } = useToaster();
  const eventFilters = computed(() => unref(filters));
  // UseAsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<EventT[]>(
    () => getKeyForGetEvents(unref(filters)),
    async () => {
      try {
        const events = await listEvents(eventFilters.value);
        store.setEvents(events);
        store.setFilters(eventFilters.value);
        return events as EventT[];
      } catch (error) {
        showToastError((error as AppError).message);
        throw error;
      }
    },
    {
      watch: [eventFilters.value],
      immediate: true,
      getCachedData: (key, nuxtApp) => {
        if (
          store.getEvents().length > 0 &&
          JSON.stringify(store.getFilters()) ===
            JSON.stringify(eventFilters.value)
        ) {
          return store.getEvents();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      },
      default: () => [],
    }
  );

  return {
    data,
    pending,
    error,
    refresh,
    filters: eventFilters.value,
  };
}

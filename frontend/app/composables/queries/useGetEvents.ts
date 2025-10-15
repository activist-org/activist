// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Event as EventT, EventFilters } from "~/types/events/event";

import { useToaster } from "~/composables/useToaster";
import { listEvents } from "~/services/event/event";
import { useEventStore } from "~/stores/event";

export function useGetEvents(
  filters: Ref<EventFilters> | ComputedRef<EventFilters>
) {
  const store = useEventStore();
  const { showToastError } = useToaster();

  // UseAsyncData for SSR, hydration, and cache
  const { data, pending, error, refresh } = useAsyncData<EventT[]>(
    () => `events-list:${JSON.stringify(unref(filters))}`,
    async () => {
      try {
        const events = await listEvents(unref(filters));
        store.setEvents(events);
        return events as EventT[];
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

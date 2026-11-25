// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a single event with Pinia Colada. Store-first, then fetch if missing.

export function useGetEvent(id: MaybeRef<string>) {
  const eventId = computed(() => String(unref(id)));
  const enabled = computed(() => !!eventId.value);
  const { getKeyForEvent } = useEventCache();

  return useCustomQuery(
    () => getKeyForEvent(eventId.value),
    () => getEvent(eventId.value),
    { enabled }
  );
}

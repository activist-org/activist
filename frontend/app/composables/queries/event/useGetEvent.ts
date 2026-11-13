// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a single event with Pinia Colada. Store-first, then fetch if missing.

export function useGetEvent(id: MaybeRef<string>) {
  const eventId = computed(() => String(unref(id)));
  const enabled = computed(() => !!eventId.value);
  const { getKeyForEvent } = useEventCache();

  const { data, isLoading, error, refresh } = useQuery({
    key: () => getKeyForEvent(eventId.value),
    query: () => getEvent(eventId.value),
    enabled,
  });
  const { handleError, error: appError } = useAppError();

  watch(error, (err) => {
    if (err) {
      handleError(err);
      if (appError.value?.status === 404) {
        showError({
          statusCode: 404,
          statusMessage: "Event not found",
        });
      }
    }
  });

  return {
    data,
    pending: isLoading,
    error: appError,
    refresh: refresh ?? (() => {}),
  };
}

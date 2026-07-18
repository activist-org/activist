// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for event text entries

export function useEventTextsMutations(eventId: MaybeRef<string>) {
  const { error, handleError } = useAppError();

  const currentEventId = computed(() => unref(eventId));
  const { invalidateEventCache } = useEventCache();

  // Update event texts.
  const { mutateAsync: updateTexts, isLoading: loading } = useMutation({
    mutation: (vars: { textId: string; data: EventUpdateTextFormData }) =>
      updateEventTexts(currentEventId.value, vars.textId, vars.data),
    onSettled() {
      invalidateEventCache(currentEventId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateTexts,
  };
}

// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for event text entries.

export function useEventTextsMutations(
  eventId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const { error, handleError } = useAppError();

  const currentEventId = computed(() => unref(eventId));
  const { invalidateEventCache } = useEventCache();

  // Update event texts.
  const { mutate: updateTexts, isLoading: loading } = useMutation({
    ...options.update,
    mutation: (vars: { textId: string; data: EventUpdateTextFormData }) =>
      updateEventTexts(currentEventId.value, vars.textId, vars.data),
    onSuccess() {
      invalidateEventCache(currentEventId.value);
      options.update?.onSuccess?.();
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

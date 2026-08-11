// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for group text entries.

export function useGroupTextsMutations(
  groupId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache } = useGroupCache();

  // Update group texts.
  const { mutate: updateTexts, isLoading: loading } = useMutation({
    mutation: (vars: { textId: string; data: GroupUpdateTextFormData }) =>
      updateGroupTexts(currentGroupId.value, vars.textId, vars.data),
    async onSuccess() {
      await invalidateGroupCache(currentGroupId.value);
      options.update?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.update,
  });

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateTexts,
  };
}

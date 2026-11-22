// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for group text entries.

export function useGroupTextsMutations(
  groupId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const { error } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache } = useGroupCache();

  // Update group texts.
  const { mutate: updateTexts, isLoading: loading } = useCustomMutation(
    options.update,
    (vars: { textId: string; data: GroupUpdateTextFormData }) =>
      updateGroupTexts(currentGroupId.value, vars.textId, vars.data),
    invalidateGroupCache,
    currentGroupId
  );

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateTexts,
  };
}

// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for group text entries.

export function useGroupTextsMutations(groupId: MaybeRef<string>) {
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache } = useGroupCache();

  // Update group texts.
  const { mutateAsync: updateTextsAsync, isLoading: loading } = useMutation({
    mutation: (vars: { textId: string; data: GroupUpdateTextFormData }) =>
      updateGroupTexts(currentGroupId.value, vars.textId, vars.data),
    async onSettled() {
      await invalidateGroupCache(currentGroupId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  // Wrapper keeps the true/false contract that the text modal relies on.
  const updateTexts = async (vars: {
    textId: string;
    data: GroupUpdateTextFormData;
  }) => {
    if (!currentGroupId.value) return false;
    try {
      await updateTextsAsync(vars);
      return true;
    } catch {
      return false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateTexts,
  };
}

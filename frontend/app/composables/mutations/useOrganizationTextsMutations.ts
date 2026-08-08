// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for organization text entries.

export function useOrganizationTextsMutations(
  organizationId: MaybeRef<string>
) {
  const { error, handleError } = useAppError();

  const currentOrganizationId = computed(() => unref(organizationId));
  const { invalidateOrganizationCache } = useOrganizationCache();

  // Update organization texts.
  const { mutateAsync: updateTextsAsync, isLoading: loading } = useMutation({
    mutation: (vars: {
      textId: string;
      data: OrganizationUpdateTextFormData;
    }) =>
      updateOrganizationTexts(
        currentOrganizationId.value,
        vars.textId,
        vars.data
      ),
    async onSettled() {
      await invalidateOrganizationCache(currentOrganizationId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  // Wrapper keeps the true/false contract that the text modal relies on.
  const updateTexts = async (vars: {
    textId: string;
    data: OrganizationUpdateTextFormData;
  }) => {
    if (!currentOrganizationId.value) return false;
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

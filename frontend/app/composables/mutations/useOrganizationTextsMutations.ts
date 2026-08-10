// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for organization text entries.

export function useOrganizationTextsMutations(
  organizationId: MaybeRef<string>
) {
  const { error, handleError } = useAppError();

  const currentOrganizationId = computed(() => unref(organizationId));
  const { invalidateOrganizationCache } = useOrganizationCache();

  // Update organization texts.
  const { mutateAsync: updateTexts, isLoading: loading } = useMutation({
    mutation: (vars: {
      textId: string;
      data: OrganizationUpdateTextFormData;
    }) =>
      updateOrganizationTexts(
        currentOrganizationId.value,
        vars.textId,
        vars.data
      ),
    async onSuccess() {
      await invalidateOrganizationCache(currentOrganizationId.value);
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

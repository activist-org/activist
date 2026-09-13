// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for organization text entries.

export function useOrganizationTextsMutations(
  orgId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const { error, handleError } = useAppError();

  const currentOrgId = computed(() => unref(orgId));
  const { invalidateOrganizationCache } = useOrganizationCache();

  // Update organization texts.
  const { mutate: updateTexts, isLoading: loading } = useMutation({
    ...options.update,
    mutation: (vars: {
      textId: string;
      data: OrganizationUpdateTextFormData;
    }) => updateOrganizationTexts(currentOrgId.value, vars.textId, vars.data),
    async onSuccess() {
      await invalidateOrganizationCache(currentOrgId.value);
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

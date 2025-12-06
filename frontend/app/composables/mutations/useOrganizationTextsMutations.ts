// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useOrganizationTextsMutations(
  organizationId: MaybeRef<string>
) {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentOrganizationId = computed(() => unref(organizationId));

  // Update organization texts.
  async function updateTexts(
    textsData: OrganizationUpdateTextFormData,
    textId: string
  ) {
    if (!currentOrganizationId.value) {
      return false;
    }

    loading.value = true;
    error.value = null;
    try {
      // Service function handles the HTTP call and throws normalized errors.
      await updateOrganizationTexts(
        currentOrganizationId.value,
        textId,
        textsData
      );
      // Refresh the organization data to get the updated texts.
      await refreshOrganizationData();
      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }
  // Helper to refresh organization data after mutations.
  async function refreshOrganizationData() {
    if (!currentOrganizationId.value) {
      return;
    }

    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(
      getKeyForGetOrganization(currentOrganizationId.value)
    );
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateTexts,
    refreshOrganizationData,
  };
}

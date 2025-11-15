// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

export function useOrganizationResourcesMutations(
  organizationId: MaybeRef<string>
) {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentOrganizationId = computed(() => unref(organizationId));

  // Create new resource.
  async function createResource(resourceData: ResourceInput) {
    if (!currentOrganizationId.value) {
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createOrganizationResource(
        currentOrganizationId.value,
        resourceData as Resource
      );

      // Refresh the organization data to get the new resource.
      await refreshOrganizationData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Update existing resource.
  async function updateResource(resource: ResourceInput) {
    loading.value = true;
    error.value = null;

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await updateOrganizationResource(currentOrganizationId.value, resource);

      // Invalidate cache and refetch fresh data.
      await refreshOrganizationData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Reorder multiple resource entries.
  async function reorderResources(resources: Resource[]) {
    loading.value = true;
    error.value = null;

    try {
      await reorderOrganizationResources(
        currentOrganizationId.value,
        resources
      );

      // Refresh to get the updated order.
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
    createResource,
    updateResource,
    reorderResources,
    refreshOrganizationData,
  };
}

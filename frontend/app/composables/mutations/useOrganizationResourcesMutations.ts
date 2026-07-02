// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData.

import { getKeyForGetOrganization } from "../queries/useGetOrganization";

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

      invalidateCacheRefreshOrgData();

      return true;
    } catch (err) {
      const appError = err as AppError;
      error.value = appError;
      showToastError(appError.message);
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

      invalidateCacheRefreshOrgData();

      return true;
    } catch (err) {
      const appError = errorHandler(err);
      error.value = appError;
      showToastError(appError.message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Delete existing resource.
  async function deleteResource(resourceId: string) {
    loading.value = true;
    error.value = null;

    try {
      await deleteOrganizationResource(resourceId);

      invalidateCacheRefreshOrgData();

      return true;
    } catch (err) {
      const appError = errorHandler(err);
      error.value = appError;
      showToastError(appError.message);
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

      invalidateCacheRefreshOrgData();

      return true;
    } catch (err) {
      const appError = errorHandler(err);
      error.value = appError;
      showToastError(appError.message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Helper to refresh organization data after mutations.
  async function invalidateCacheRefreshOrgData() {
    if (!currentOrganizationId.value) {
      return;
    }
    // Clear first: with dedupe "defer" a bare refreshNuxtData can be dropped on
    // collision, leaving the list stale (e.g. a deleted entry lingering).
    const key = getKeyForGetOrganization(currentOrganizationId.value);
    clearNuxtData(key);
    await refreshNuxtData(key);
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    createResource,
    updateResource,
    deleteResource,
    reorderResources,
    invalidateCacheRefreshOrgData,
  };
}

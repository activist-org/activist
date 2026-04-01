// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for group resources - uses direct service calls, not useAsyncData.

export function useGroupResourcesMutations(groupId: MaybeRef<string>) {
  const { error, handleError, clearError } = useAppError();

  const loading = ref(false);

  const currentGroupId = computed(() => unref(groupId));

  // Create new resource.
  async function createResource(resourceData: ResourceInput) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    clearError();

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createGroupResource(currentGroupId.value, resourceData as Resource);

      // Refresh the group data to get the new resource.
      await refreshGroupData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Update existing resource.
  async function updateResource(resource: ResourceInput) {
    loading.value = true;
    clearError();

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await updateGroupResource(resource);

      // Invalidate cache and refetch fresh data.
      await refreshGroupData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Delete existing resource.
  async function deleteResource(resourceId: string) {
    loading.value = true;
    clearError();

    try {
      await deleteGroupResource(resourceId);

      // Invalidate cache and refetch fresh data.
      await refreshGroupData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Reorder multiple resource entries.
  async function reorderResources(resources: Resource[]) {
    loading.value = true;
    clearError();

    try {
      await reorderGroupResources(resources);

      // Refresh to get the updated order.
      await refreshGroupData();

      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Helper to refresh group data after mutations.
  async function refreshGroupData() {
    if (!currentGroupId.value) {
      return;
    }
    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(getKeyForGetGroup(currentGroupId.value));
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    createResource,
    updateResource,
    deleteResource,
    reorderResources,
    refreshGroupData,
  };
}

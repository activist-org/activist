// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for group resources - uses Pinia Colada for cache invalidation.

export function useGroupResourcesMutations(groupId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache } = useGroupCache();

  // Create new resource.
  const { mutateAsync: createResourceAsync, isLoading: loadingCreateResource } =
    useMutation({
      mutation: (resourceData: ResourceInput) =>
        createGroupResource(currentGroupId.value, resourceData as Resource),
      async onSettled() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Update existing resource.
  const { mutateAsync: updateResourceAsync, isLoading: loadingUpdateResource } =
    useMutation({
      mutation: (resource: ResourceInput) => updateGroupResource(resource),
      async onSettled() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete existing resource.
  const { mutateAsync: deleteResourceAsync, isLoading: loadingDeleteResource } =
    useMutation({
      mutation: (resourceId: string) => deleteGroupResource(resourceId),
      async onSettled() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Reorder multiple resource entries.
  const {
    mutateAsync: reorderResourcesAsync,
    isLoading: loadingReorderResources,
  } = useMutation({
    mutation: (orderedResources: Resource[]) =>
      reorderGroupResources(orderedResources),
    async onSettled() {
      await invalidateGroupCache(currentGroupId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  // Wrappers keep the true/false contract that call sites rely on.
  const createResource = async (resourceData: ResourceInput) => {
    if (!currentGroupId.value) return false;
    try {
      await createResourceAsync(resourceData);
      return true;
    } catch {
      return false;
    }
  };

  const updateResource = async (resource: ResourceInput) => {
    try {
      await updateResourceAsync(resource);
      return true;
    } catch {
      return false;
    }
  };

  const deleteResource = async (resourceId: string) => {
    try {
      await deleteResourceAsync(resourceId);
      return true;
    } catch {
      return false;
    }
  };

  const reorderResources = async (resources: Resource[]) => {
    try {
      await reorderResourcesAsync(resources);
      return true;
    } catch {
      return false;
    }
  };

  watch(
    [
      loadingCreateResource,
      loadingUpdateResource,
      loadingDeleteResource,
      loadingReorderResources,
    ],
    ([create, update, del, reorder]) => {
      loading.value = create || update || del || reorder;
    }
  );

  return {
    loading: readonly(loading),
    error: readonly(error),
    createResource,
    updateResource,
    deleteResource,
    reorderResources,
  };
}

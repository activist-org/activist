// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for Resource entries - uses Pinia Colada for cache invalidation.

export function useOrganizationResourcesMutations(
  organizationId: MaybeRef<string>
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentOrganizationId = computed(() => unref(organizationId));
  const { invalidateOrganizationCache } = useOrganizationCache();

  // Create new resource.
  const { mutateAsync: createResourceAsync, isLoading: loadingCreateResource } =
    useMutation({
      mutation: (resourceData: ResourceInput) =>
        createOrganizationResource(
          currentOrganizationId.value,
          resourceData as Resource
        ),
      async onSettled() {
        await invalidateOrganizationCache(currentOrganizationId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Update existing resource.
  const { mutateAsync: updateResourceAsync, isLoading: loadingUpdateResource } =
    useMutation({
      mutation: (resource: ResourceInput) =>
        updateOrganizationResource(currentOrganizationId.value, resource),
      async onSettled() {
        await invalidateOrganizationCache(currentOrganizationId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete existing resource.
  const { mutateAsync: deleteResourceAsync, isLoading: loadingDeleteResource } =
    useMutation({
      mutation: (resourceId: string) => deleteOrganizationResource(resourceId),
      async onSettled() {
        await invalidateOrganizationCache(currentOrganizationId.value);
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
      reorderOrganizationResources(
        currentOrganizationId.value,
        orderedResources
      ),
    async onSettled() {
      await invalidateOrganizationCache(currentOrganizationId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  // Wrappers keep the true/false contract that call sites rely on.
  const createResource = async (resourceData: ResourceInput) => {
    if (!currentOrganizationId.value) return false;
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

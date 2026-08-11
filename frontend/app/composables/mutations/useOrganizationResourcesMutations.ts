// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for Resource entries - uses Pinia Colada for cache invalidation.

export function useOrganizationResourcesMutations(
  organizationId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentOrganizationId = computed(() => unref(organizationId));
  const { invalidateOrganizationCache } = useOrganizationCache();

  // Create new resource.
  const { mutate: createResource, isLoading: loadingCreateResource } =
    useMutation({
      mutation: (resourceData: ResourceInput) =>
        createOrganizationResource(
          currentOrganizationId.value,
          resourceData as Resource
        ),
      async onSuccess() {
        await invalidateOrganizationCache(currentOrganizationId.value);
        options.create?.onSuccess?.();
      },
      onError(err) {
        handleError(err);
      },
      ...options.create,
    });

  // Update existing resource.
  const { mutate: updateResource, isLoading: loadingUpdateResource } =
    useMutation({
      mutation: (resource: ResourceInput) =>
        updateOrganizationResource(currentOrganizationId.value, resource),
      async onSuccess() {
        await invalidateOrganizationCache(currentOrganizationId.value);
        options.update?.onSuccess?.();
      },
      onError(err) {
        handleError(err);
      },
      ...options.update,
    });

  // Delete existing resource.
  const { mutate: deleteResource, isLoading: loadingDeleteResource } =
    useMutation({
      mutation: (resourceId: string) => deleteOrganizationResource(resourceId),
      async onSuccess() {
        await invalidateOrganizationCache(currentOrganizationId.value);
        options.delete?.onSuccess?.();
      },
      onError(err) {
        handleError(err);
      },
      ...options.delete,
    });

  // Reorder multiple resource entries.
  const { mutate: reorderResources, isLoading: loadingReorderResources } =
    useMutation({
      mutation: (orderedResources: Resource[]) =>
        reorderOrganizationResources(
          currentOrganizationId.value,
          orderedResources
        ),
      async onSuccess() {
        await invalidateOrganizationCache(currentOrganizationId.value);
        options.reorder?.onSuccess?.();
      },
      onError(err) {
        handleError(err);
      },
      ...options.reorder,
    });

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

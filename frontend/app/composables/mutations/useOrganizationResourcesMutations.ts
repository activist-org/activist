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
  const { mutateAsync: createResource, isLoading: loadingCreateResource } =
    useMutation({
      mutation: (resourceData: ResourceInput) =>
        createOrganizationResource(
          currentOrganizationId.value,
          resourceData as Resource
        ),
      async onSuccess() {
        await invalidateOrganizationCache(currentOrganizationId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Update existing resource.
  const { mutateAsync: updateResource, isLoading: loadingUpdateResource } =
    useMutation({
      mutation: (resource: ResourceInput) =>
        updateOrganizationResource(currentOrganizationId.value, resource),
      async onSuccess() {
        await invalidateOrganizationCache(currentOrganizationId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete existing resource.
  const { mutateAsync: deleteResource, isLoading: loadingDeleteResource } =
    useMutation({
      mutation: (resourceId: string) => deleteOrganizationResource(resourceId),
      async onSuccess() {
        await invalidateOrganizationCache(currentOrganizationId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Reorder multiple resource entries.
  const { mutateAsync: reorderResources, isLoading: loadingReorderResources } =
    useMutation({
      mutation: (orderedResources: Resource[]) =>
        reorderOrganizationResources(
          currentOrganizationId.value,
          orderedResources
        ),
      async onSuccess() {
        await invalidateOrganizationCache(currentOrganizationId.value);
      },
      onError(err) {
        handleError(err);
      },
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

// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for Resource entries - uses Pinia Colada for cache invalidation.

export function useOrganizationResourcesMutations(
  orgId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentOrgId = computed(() => unref(orgId));
  const { invalidateOrganizationCache } = useOrganizationCache();

  // Create new resource.
  const { mutate: createResource, isLoading: loadingCreateResource } =
    useMutation({
      ...options.create,
      mutation: (resourceData: ResourceInput) =>
        createOrganizationResource(
          currentOrgId.value,
          resourceData as Resource
        ),
      async onSuccess() {
        await invalidateOrganizationCache(currentOrgId.value);
        options.create?.onSuccess?.();
      },
      onError(err) {
        handleError(err);
      },
    });

  // Update existing resource.
  const { mutate: updateResource, isLoading: loadingUpdateResource } =
    useMutation({
      ...options.update,
      mutation: (resource: ResourceInput) =>
        updateOrganizationResource(currentOrgId.value, resource),
      async onSuccess() {
        await invalidateOrganizationCache(currentOrgId.value);
        options.update?.onSuccess?.();
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete existing resource.
  const { mutate: deleteResource, isLoading: loadingDeleteResource } =
    useMutation({
      ...options.delete,
      mutation: (resourceId: string) => deleteOrganizationResource(resourceId),
      async onSuccess() {
        await invalidateOrganizationCache(currentOrgId.value);
        options.delete?.onSuccess?.();
      },
      onError(err) {
        handleError(err);
      },
    });

  // Reorder multiple resource entries.
  const { mutate: reorderResources, isLoading: loadingReorderResources } =
    useMutation({
      ...options.reorder,
      mutation: (orderedResources: Resource[]) =>
        reorderOrganizationResources(currentOrgId.value, orderedResources),
      async onSuccess() {
        await invalidateOrganizationCache(currentOrgId.value);
        options.reorder?.onSuccess?.();
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

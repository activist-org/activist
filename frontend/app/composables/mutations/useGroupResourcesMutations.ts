// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for group resources - uses Pinia Colada for cache invalidation.

export function useGroupResourcesMutations(groupId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache } = useGroupCache();

  // Create new resource.
  const { mutateAsync: createResource, isLoading: loadingCreateResource } =
    useMutation({
      mutation: (resourceData: ResourceInput) =>
        createGroupResource(currentGroupId.value, resourceData as Resource),
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Update existing resource.
  const { mutateAsync: updateResource, isLoading: loadingUpdateResource } =
    useMutation({
      mutation: (resource: ResourceInput) => updateGroupResource(resource),
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete existing resource.
  const { mutateAsync: deleteResource, isLoading: loadingDeleteResource } =
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
  const { mutateAsync: reorderResources, isLoading: loadingReorderResources } =
    useMutation({
      mutation: (orderedResources: Resource[]) =>
        reorderGroupResources(orderedResources),
      async onSettled() {
        await invalidateGroupCache(currentGroupId.value);
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

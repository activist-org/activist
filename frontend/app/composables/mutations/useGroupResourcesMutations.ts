// SPDX-License-Identifier: AGPL-3.0-or-later

export function useGroupResourcesMutations(
  groupId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache } = useGroupCache();

  // Create new resource.
  const { mutate: createResource, isLoading: loadingCreateResource } =
    useMutation({
      mutation: (resourceData: ResourceInput) =>
        createGroupResource(currentGroupId.value, resourceData as Resource),
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
      },
      onError(err) {
        handleError(err);
      },
      ...options.create,
    });

  // Update existing resource.
  const { mutate: updateResource, isLoading: loadingUpdateResource } =
    useMutation({
      mutation: (resource: ResourceInput) => updateGroupResource(resource),
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
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
      mutation: (resourceId: string) => deleteGroupResource(resourceId),
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
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
        reorderGroupResources(orderedResources),
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
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

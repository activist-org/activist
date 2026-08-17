// SPDX-License-Identifier: AGPL-3.0-or-later

export function useGroupResourcesMutations(
  groupId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentGroupId = computed(() => unref(groupId));
  const { invalidateGroupCache, getKeyForGroup } = useGroupCache();
  const queryCache = useQueryCache();

  // Create new resource.
  const { mutate: createResource, isLoading: loadingCreateResource } =
    useMutation({
      ...options.create,
      mutation: (resourceData: ResourceInput) =>
        createGroupResource(currentGroupId.value, resourceData as Resource),
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
        options?.create?.onSuccess?.();
      },
      onError(err) {
        handleError(err);
      },
    });

  // Update existing resource.
  const { mutate: updateResource, isLoading: loadingUpdateResource } =
    useMutation({
      ...options.update,
      mutation: (resource: ResourceInput) => updateGroupResource(resource),
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
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
      mutation: (resourceId: string) => deleteGroupResource(resourceId),
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
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
        reorderGroupResources(orderedResources),
      onMutate(orderedResources) {
        const key = getKeyForGroup(currentGroupId.value);
        const previousGroup = queryCache.getQueryData<Group>(key);
        if (previousGroup) {
          queryCache.setQueryData(key, {
            ...previousGroup,
            resources: orderedResources,
          });
        }
        return { previousGroup };
      },
      async onSuccess() {
        await invalidateGroupCache(currentGroupId.value);
        options.reorder?.onSuccess?.();
      },
      onError(err, _orderedResources, context) {
        if (context?.previousGroup) {
          queryCache.setQueryData(
            getKeyForGroup(currentGroupId.value),
            context.previousGroup
          );
        }
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

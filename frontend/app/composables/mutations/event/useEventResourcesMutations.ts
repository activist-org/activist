// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for Resource entries - uses direct service calls, not useAsyncData.

export function useEventResourcesMutations(
  eventId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentEventId = computed(() => unref(eventId));
  const { invalidateEventCache, getKeyForEvent } = useEventCache();
  const queryCache = useQueryCache();
  // Create new resource.
  const { mutate: createResource, isLoading: loadingCreateResource } =
    useMutation({
      ...options.create,
      mutation: (resourceData: ResourceInput) =>
        createEventResource(currentEventId.value, resourceData as Resource),
      async onSuccess() {
        await invalidateEventCache(currentEventId.value);
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
      mutation: (resourceData: ResourceInput) =>
        updateEventResource(currentEventId.value, resourceData as Resource),
      async onSuccess() {
        await invalidateEventCache(currentEventId.value);
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
      mutation: (resourceId: string) => deleteEventResource(resourceId),
      async onSuccess() {
        await invalidateEventCache(currentEventId.value);
        options.delete?.onSuccess?.();
      },
      onError(err) {
        handleError(err);
      },
    });

  const { mutate: reorderResources, isLoading: loadingReorderResources } =
    useMutation({
      ...options.reorder,
      mutation: (orderedResources: Resource[]) =>
        reorderEventResources(currentEventId.value, orderedResources),
      onMutate(orderedResources) {
        const key = getKeyForEvent(currentEventId.value);
        const previousEvent = queryCache.getQueryData<CommunityEvent>(key);
        if (previousEvent) {
          queryCache.setQueryData(key, {
            ...previousEvent,
            resources: orderedResources,
          });
        }
        return { previousEvent };
      },
      async onSuccess() {
        await invalidateEventCache(currentEventId.value);
        options.reorder?.onSuccess?.();
      },
      onError(err, _orderedResources, context) {
        if (context?.previousEvent) {
          queryCache.setQueryData(
            getKeyForEvent(currentEventId.value),
            context.previousEvent
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
    error,
    createResource,
    updateResource,
    deleteResource,
    reorderResources,
  };
}

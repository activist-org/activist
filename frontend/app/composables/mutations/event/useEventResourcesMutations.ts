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

  // Writes the new order into the query cache before the request resolves so
  // the list never snaps back to the stale server order mid-drag, and rolls
  // back on failure.
  const { mutate: reorderResources, isLoading: loadingReorderResources } =
    useMutation({
      ...options.reorder,
      mutation: (orderedResources: Resource[]) =>
        reorderEventResources(currentEventId.value, orderedResources),
      onMutate(orderedResources) {
        const key = getKeyForEvent(currentEventId.value);
        const previousEvent = queryCache.getQueryData<EventResponse>(key);
        if (previousEvent) {
          queryCache.setQueryData(key, {
            ...previousEvent,
            resources: orderedResources,
          });
        }
        return { previousEvent };
      },
      onError(err, _orderedResources, { previousEvent }) {
        if (previousEvent) {
          queryCache.setQueryData(
            getKeyForEvent(currentEventId.value),
            previousEvent
          );
        }
        handleError(err);
      },
      async onSuccess() {
        options.reorder?.onSuccess?.();
      },
      async onSettled() {
        await invalidateEventCache(currentEventId.value);
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

// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for Resource entries - uses direct service calls, not useAsyncData.

export function useEventResourcesMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentEventId = computed(() => unref(eventId));
  const { invalidateEventCache, getKeyForEvent } = useEventCache();
  const queryCache = useQueryCache();
  // Create new resource.
  const { mutateAsync: createResource, isLoading: loadingCreateResource } =
    useMutation({
      mutation: (resourceData: ResourceInput) =>
        createEventResource(currentEventId.value, resourceData as Resource),
      async onSettled() {
        await invalidateEventCache(currentEventId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Update existing resource.
  const { mutateAsync: updateResource, isLoading: loadingUpdateResource } =
    useMutation({
      mutation: (resourceData: ResourceInput) =>
        updateEventResource(currentEventId.value, resourceData as Resource),
      async onSettled() {
        await invalidateEventCache(currentEventId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Delete existing resource.
  const { mutateAsync: deleteResource, isLoading: loadingDeleteResource } =
    useMutation({
      mutation: (resourceId: string) => deleteEventResource(resourceId),
      async onSettled() {
        await invalidateEventCache(currentEventId.value);
      },
      onError(err) {
        handleError(err);
      },
    });

  // Reorder multiple resource entries.
  // Writes the new order into the query cache before the request resolves so
  // the list never snaps back to the stale server order mid-drag, and rolls
  // back on failure.
  const { mutateAsync: reorderResources, isLoading: loadingReorderResources } =
    useMutation({
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

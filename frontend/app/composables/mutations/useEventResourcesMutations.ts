// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for Resource entries - uses direct service calls, not useAsyncData.

export function useEventResourcesMutations(eventId: MaybeRef<string>) {
  const loading = ref(false);
  const { error, handleError } = useAppError();

  const currentEventId = computed(() => unref(eventId));
  const { invalidateEventCache } = useEventCache();
  // Create new resource.
  const {
    mutate: createResource,
    isLoading: loadingCreateResource,
  } = useMutation({
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
  const {
    mutate: updateResource,
    isLoading: loadingUpdateResource,
  } = useMutation({
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
  const {
    mutate: deleteResource,
    isLoading: loadingDeleteResource,
  } = useMutation({
    mutation: (resourceId: string) => deleteEventResource(resourceId),
    async onSettled() {
      await invalidateEventCache(currentEventId.value);
    },
    onError(err) {
      handleError(err);
    },
  });

  // Reorder multiple resource entries.
  const {
    mutate: reorderResources,
    isLoading: loadingReorderResources,
  } = useMutation({
    mutation: (orderedResources: Resource[]) =>
      reorderEventResources(currentEventId.value, orderedResources),
    async onSettled() {
      await invalidateEventCache(currentEventId.value);
    },
    onError(err) {
       handleError(err);
    },
  });

  watch(
    [loadingCreateResource, loadingUpdateResource, loadingDeleteResource, loadingReorderResources],
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
    reorderResources
  };
}

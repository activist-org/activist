

export function useEventSupportMutations(eventId:MaybeRef<string>, options: OptionMutation = {}) {
  const event = computed(() => unref(eventId))
  const {invalidateEventCache} = useEventCache()
  const { invalidateUserCache } = useUserCache()
  const { handleError } = useAppError()
  const {
    mutate: createSupport,
    isLoading: loadingCreateSupport,
  } = useMutation({
    ...options.create,
    mutation: async () => {
    if (!event.value) return null;
      return createEventSupport(event.value);
    },
    async onSuccess() {
      await invalidateEventCache(event.value);
      await invalidateUserCache();
    },
    onError(err) {
      handleError(err);
    },
  })
  const {
    mutate: deleteSupport,
    isLoading: loadingDeleteSupport,
  } = useMutation({
    ...options.delete,
    mutation: async () => {
      if (!event.value) return null;
      return deleteEventSupport(event.value);
    },
    async onSuccess() {
      await invalidateEventCache(event.value);
      await invalidateUserCache();
    },
    onError(err) {
      handleError(err);
    },
  })

  const loading = computed(() => loadingCreateSupport || loadingDeleteSupport)

  return {
    createSupport,
    deleteSupport,
    loading:readonly(loading),
  }
}


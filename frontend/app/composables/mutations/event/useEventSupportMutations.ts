

export function useEventSupportMutations(eventId:MaybeRef<string>, options: OptionMutation = {}) {
  const event = computed(() => unref(eventId))
  const {invalidateEventCache, getKeyForEvent} = useEventCache()
  const { invalidateUserCache } = useUserCache()
  const { handleError } = useAppError()
  const queryCache = useQueryCache()
  const {
    mutate: createSupport,
    isLoading: loadingCreateSupport,
  } = useMutation({
    ...options.create,
    mutation: async () => {
    if (!event.value) return null;
      return createEventSupport(event.value);
    },
     onMutate() {
      const key = getKeyForEvent(event.value);
      const previousEvent = queryCache.getQueryData<CommunityEvent>(key);
      if (previousEvent) {
        queryCache.setQueryData(key, {
          ...previousEvent,
          supporterCount: (previousEvent.supporterCount ?? 0) + 1,
        });
      }
      return { previousEvent };
    },
    onError(err, _orderedFaqs, context) {
      if (context?.previousEvent) {
        queryCache.setQueryData(
          getKeyForEvent(event.value),
          context.previousEvent
        );
      }
      handleError(err);
    },
    async onSuccess() {
      await invalidateEventCache(event.value);
      await invalidateUserCache();
    }
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
   onMutate() {
      const key = getKeyForEvent(event.value);
      const previousEvent = queryCache.getQueryData<CommunityEvent>(key);
      if (previousEvent) {
        queryCache.setQueryData(key, {
          ...previousEvent,
          supporterCount: previousEvent.supporterCount ?? 0 ? (previousEvent.supporterCount ?? 0) - 1 : 0,
        });
      }
      return { previousEvent };
    },
    onError(err, _orderedFaqs, context) {
      if (context?.previousEvent) {
        queryCache.setQueryData(
          getKeyForEvent(event.value),
          context.previousEvent
        );
      }
      handleError(err);
    },
    async onSuccess() {
      await invalidateEventCache(event.value);
      await invalidateUserCache();
    }
  })

  const loading = computed(() => loadingCreateSupport || loadingDeleteSupport)

  return {
    createSupport,
    deleteSupport,
    loading:readonly(loading),
  }
}


// SPDX-License-Identifier: AGPL-3.0-or-later
export const useEventMutations = (options: OptionMutation = {}) => {
  const { error, handleError } = useAppError();
  const { invalidateEventList } = useEventCache();

  const {
    mutate: create,
    mutateAsync: createAsync,
    isLoading: loading,
  } = useMutation({
    ...options.create,
    mutation: (eventData: CreateEventInput) => createEvent(eventData),
    onError(err) {
      handleError(err);
    },
    async onSuccess() {
      await invalidateEventList();
      options.create?.onSuccess?.();
    },
  });

  const refreshEventList = async () => {
    // Invalidate and refetch event list data.
    // Invalidate the useAsyncData cache so next read will refetch.
    await invalidateEventList();
  };

  return {
    loading,
    error,
    create,
    createAsync,
    refreshEventList,
  };
};

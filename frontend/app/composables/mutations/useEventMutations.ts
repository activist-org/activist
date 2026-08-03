// SPDX-License-Identifier: AGPL-3.0-or-later

export const useEventMutations = () => {
  const { error, handleError } = useAppError();
  const { invalidateEventList } = useEventCache();

  const { mutateAsync: create, isLoading: loading } = useMutation({
    mutation: (eventData: CreateEventInput) => createEvent(eventData),
    onError(err) {
      handleError(err);
    },
    async onSettled() {
      await invalidateEventList();
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
    refreshEventList,
  };
};

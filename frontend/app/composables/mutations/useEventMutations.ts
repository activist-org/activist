// SPDX-License-Identifier: AGPL-3.0-or-later

export const useEventMutations = () => {
  const { error, handleError } = useAppError();
  const store = useEventListStore();

  const {
    mutate: create,
    isLoading: loading,
  } = useMutation({
    mutation: (eventData: CreateEventInput) => createEvent(eventData),
    onError(err) {
      handleError(err);
    },
    onSettled() {
      refreshEventList();
    }
  });

  const refreshEventList = async () => {
    // Invalidate and refetch event list data.
    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(getKeyForGetEvents());
    // Clear cached events to force refetch with new data.
    store.setItems([]);
  };

  return {
    loading,
    error,
    create,
    refreshEventList,
  };
};

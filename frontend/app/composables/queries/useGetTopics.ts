// SPDX-License-Identifier: AGPL-3.0-or-later

export const getKeyForGetTopics = () => `topics-list`;

export function useGetTopics() {
  const store = useTopics();
  const { showToastError } = useToaster();

  // UseAsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<Topic[]>(
    () => getKeyForGetTopics(),
    async () => {
      try {
        const topics = await listTopics();
        store.setTopics(topics);
        return topics as Topic[];
      } catch (error) {
        showToastError((error as AppError).message);
        throw error;
      }
    },
    {
      immediate: true,
      getCachedData: (key, nuxtApp) => {
        if (store.getTopics().length > 0) {
          return store.getTopics();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      },
      default: () => [],
    }
  );
  return {
    data,
    pending,
    error,
    refresh,
  };
}

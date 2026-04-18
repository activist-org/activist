// SPDX-License-Identifier: AGPL-3.0-or-later
export const getKeyForGetTopics = () => `topics-list`;

/**
 * Composable for fetching and managing the list of topics in the frontend application.
 * This composable uses the useAsyncData hook to fetch the list of topics from the server, handle loading and error states, and cache the data for efficient retrieval.
 * The fetched topics are stored in a Vuex store using the useTopics composable, allowing other components to access and reactively update based on the list of topics.
 * The composable also integrates error handling using the useAppError composable to manage any errors that occur during the data fetching process.
 * The returned object includes the data, pending state, error state, and a refresh function to manually trigger a re-fetch of the topics.
 * @returns An object containing the data (list of topics), pending state, error state, and a refresh function for managing the fetching and state of topics in the application.
 */
export function useGetTopics() {
  const store = useTopics();
  const { handleError } = useAppError();

  // UseAsyncData for SSR, hydration, and cache.
  const { data, pending, error, refresh } = useAsyncData<Topic[]>(
    () => getKeyForGetTopics(),
    async () => {
      try {
        const topics = await listTopics();
        store.setTopics(topics);
        return topics as Topic[];
      } catch (error) {
        handleError(error);
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

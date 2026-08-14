// SPDX-License-Identifier: AGPL-3.0-or-later

export function useGetTopics() {
  const { handleError } = useAppError();
  const { getKeyForTopics } = useTopicCache();

  const { data, isLoading, error, refresh } = useQuery({
    key: getKeyForTopics(),
    query: async () => listTopics(),
  });
  watch(error, (err) => {
    if (err) {
      handleError(err);
    }
  });
  return {
    data,
    pending: readonly(isLoading),
    error,
    refresh,
  };
}

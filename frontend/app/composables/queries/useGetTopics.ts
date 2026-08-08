// SPDX-License-Identifier: AGPL-3.0-or-later
export const KEY_GET_TOPICS = ["get-topics"];

export function useGetTopics() {
  const { handleError } = useAppError();

  const { data, isLoading, error, refresh } = useQuery({
    key: KEY_GET_TOPICS,
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

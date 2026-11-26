// SPDX-License-Identifier: AGPL-3.0-or-later
export function useGetTopics() {
  const { getKeyForTopics } = useTopicCache();

  const { data, pending, error, refresh } = useCustomQuery(
    getKeyForTopics(),
    async () => listTopics()
  );

  return {
    data,
    pending: readonly(pending),
    error,
    refresh,
  };
}

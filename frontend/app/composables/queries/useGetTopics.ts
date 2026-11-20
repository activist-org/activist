// SPDX-License-Identifier: AGPL-3.0-or-later
export function useGetTopics() {
  const { getKeyForTopics } = useTopicCache();

  const key = getKeyForTopics();
  const { data, pending, error, refresh } = useCustomQuery<Topic[]>(
    key,
    async () => listTopics()
  );

  return {
    data,
    pending: readonly(pending),
    error,
    refresh,
  };
}

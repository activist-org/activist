// SPDX-License-Identifier: AGPL-3.0-or-later
export function useGetTopics() {
  const { getKeyForTopics } = useTopicCache();

  return useCustomQuery(getKeyForTopics(), async () => listTopics());
}

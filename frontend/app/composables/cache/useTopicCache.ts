// SPDX-License-Identifier: AGPL-3.0-or-later
export const KEY_GET_TOPICS = ["topics"];

export const useTopicCache = () => {
  const { getEntries } = useQueryCache();

  const topicCacheEntries = () => getEntries({ key: KEY_GET_TOPICS });
  const getKeyForTopics = () => KEY_GET_TOPICS;

  return {
    topicCacheEntries,
    getKeyForTopics,
  };
};

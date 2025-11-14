// SPDX-License-Identifier: AGPL-3.0-or-later

interface TopicStore {
  topics: Topic[];
}

export const useTopics = defineStore("topics", {
  // MARK: Properties

  state: (): TopicStore => ({
    topics: [],
  }),

  actions: {
    setTopics(topics: Topic[]) {
      this.topics = topics;
    },
    getTopics(): Topic[] {
      return this.topics;
    },
  },
});

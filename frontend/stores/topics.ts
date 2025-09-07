// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Topic } from "~/types/content/topics";

interface TopicStore {
  loading: boolean;
  topics: Topic[];
}

export const useTopics = defineStore("topics", {
  // MARK: Properties

  state: (): TopicStore => ({
    loading: false,

    topics: [],
  }),

  actions: {
    // MARK: Fetch All

    async fetchAll() {
      this.loading = true;

      const { data, status } = await useAsyncData<Topic[]>(
        async () => (await fetchWithoutToken(`/content/topics`, [])) as Topic[]
      );

      if (status.value === "success") {
        const topics = (data.value ?? []).map((topic: Topic) => {
          return {
            type: topic.type,
            active: topic.active,
            creation_date: topic.creation_date,
            last_updated: topic.last_updated,
            deprecation_date: topic.deprecation_date,
            id: topic.id,
          };
        });

        this.topics = topics;
      }

      this.loading = false;
    },
  },
});

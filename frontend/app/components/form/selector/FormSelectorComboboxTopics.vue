<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormSelectorCombobox
    @update:selectedOptions="(val: unknown) => handleChange(val as TopicEnum[])"
    :id="id"
    :options="options"
    :label="label"
    :hasColOptions="hasColOptions"
    :selectedOptions="selectedTopics || []"
  />
</template>

<script setup lang="ts">
import type { Topic, TopicEnum } from "~/types/content/topics";

import { GLOBAL_TOPICS } from "~/types/content/topics";

const { t } = useI18n();
const topicsStore = useTopics();
await topicsStore.fetchAll();

const topics = topicsStore.topics || [];

const options = ref<{ label: string; value: TopicEnum; id: string }[]>([]);
options.value = topics.map((topic: Topic) => ({
  label: t(GLOBAL_TOPICS.find((t) => t.topic === topic.type)?.label || ""),
  value: topic.type as TopicEnum,
  id: topic.id,
}));

interface Props {
  id: string;
  selectedTopics: TopicEnum[];
  label: string;
  hasColOptions?: boolean;
}
withDefaults(defineProps<Props>(), {
  hasColOptions: true,
});

const emit = defineEmits<{
  (e: "update:selectedTopics", value: TopicEnum[]): void;
}>();
const handleChange = (newValue: TopicEnum[]) => {
  emit("update:selectedTopics", newValue);
};
</script>

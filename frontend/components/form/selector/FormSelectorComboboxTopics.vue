<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormSelectorCombobox
    @update:selectedOptions="(val: unknown) => handleChange(val as Topic[])"
    :id="id"
    :options="options"
    :label="label"
  />
</template>

<script setup lang="ts">
import { GLOBAL_TOPICS, type Topic } from "~/types/content/topics";

const { t } = useI18n();
const topicsStore = useTopics();
await topicsStore.fetchAll();
const topics = topicsStore.topics || [];
const options = ref<{ label: string; value: Topic; id: string }[]>([]);
options.value = topics.map((topic: Topic) => ({
  label: t(GLOBAL_TOPICS.find((t) => t.topic === topic.type)?.label || ""),
  value: topic,
  id: topic.id,
}));
interface Props {
  id: string;
  selectedTopics: Topic[];
  label: string;
}

const emit = defineEmits<{
  (e: "update:selectedTopics", value: Topic[]): void;
}>();
const handleChange = (newValue: Topic[]) => {
  emit("update:selectedTopics", newValue);
};
defineProps<Props>();
</script>

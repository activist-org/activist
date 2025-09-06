<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormSelectorCombobox
    @update:selectedOptions="(val: unknown) => handleChange(val as TopicEnum[])"
    :id="id"
    :options="options"
    :label="label"
  />
</template>

<script setup lang="ts">
import type { TopicEnum } from "~/types/content/topics";

import { GLOBAL_TOPICS } from "~/types/content/topics";

const { t } = useI18n();

const options = GLOBAL_TOPICS.map((topic, index) => ({
  label: t(topic.label),
  value: topic.value,
  id: index,
}));
interface Props {
  id: string;
  selectedTopics: TopicEnum[];
  label: string;
}

const emit = defineEmits<{
  (e: "update:selectedTopics", value: TopicEnum[]): void;
}>();
const handleChange = (newValue: TopicEnum[]) => {
  emit("update:selectedTopics", newValue);
};
defineProps<Props>();
</script>

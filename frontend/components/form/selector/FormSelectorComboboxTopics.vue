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
import type { Topic } from "~/types/topics";

import { GLOBAL_TOPICS } from "~/types/topics";

const { t } = useI18n();

const options = GLOBAL_TOPICS.map((topic, index) => ({
  label: t(topic.label),
  value: topic.value,
  id: index,
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

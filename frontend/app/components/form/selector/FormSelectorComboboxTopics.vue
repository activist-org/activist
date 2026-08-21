<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormSelectorCombobox
    :id="id"
    @update:selectedOptions="
      (val: unknown) => handleChange(val as TopicTypeType[])
    "
    :hasColOptions="hasColOptions"
    :label="label"
    :options="options"
    :selectedOptions="selectedTopics || []"
  />
</template>

<script setup lang="ts">
const { t } = useI18n();
const { data: topics } = useGetTopics();

const options = ref<{ label: string; value: TopicTypeType; id: string }[]>([]);
options.value = (topics?.value || []).map((topic: Topic) => ({
  label: t(GLOBAL_TOPICS.find((t) => t.topic === topic.type)?.label || ""),
  value: topic.type as TopicTypeType,
  id: topic.id,
}));

interface Props {
  id: string;
  selectedTopics: TopicTypeType[];
  label: string;
  hasColOptions?: boolean;
}
withDefaults(defineProps<Props>(), {
  hasColOptions: true,
});

const emit = defineEmits<{
  (e: "update:selectedTopics", value: TopicTypeType[]): void;
}>();
const handleChange = (newValue: TopicTypeType[]) => {
  emit("update:selectedTopics", newValue);
};
</script>

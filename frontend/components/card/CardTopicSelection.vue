<template>
  <Combobox
    v-model="value"
    v-slot="{ open }"
    multiple
    as="div"
    class="w-full card-style px-5 py-6"
  >
    <ComboboxLabel
      as="h2"
      class="block font-medium responsive-h3 mb-1 dark:text-dark-text"
    >
      {{ $t("components.card-topic-selection.header") }}
    </ComboboxLabel>

    <ComboboxInput
      @change="query = $event.target.value"
      :display-value="() => query"
      placeholder="Select a topic"
      class="py-2 w-full bg-transparent border-b-2 dark:text-dark-special-text"
    />

    <ComboboxOptions
      static
      class="flex flex-col gap-1 mt-2 md:flex-row md:items-center"
    >
      <ComboboxOption
        v-for="topic of filteredTopics"
        v-slot="{ active, selected }"
        :key="topic.value"
        :value="topic.value"
        as="template"
      >
        <li
          class="flex justify-between items-center gap-2 rounded-lg p-2 border bg-light-btn border-dark-btn font-bold cursor-pointer hover:bg-light-cta-orange-hover hover:dark:bg-dark-cta-orange-hover"
          :class="{
            'outline outline-blue-400 bg-light-cta-orange-hover dark:bg-dark-cta-orange-hover':
              active && open,
            'bg-light-cta-orange dark:bg-dark-cta-orange': selected,
          }"
        >
          <span class="flex items-center gap-2">
            <Icon :name="topic.icon" size="20" />
            {{ $t(topic.label) }}
          </span>
          <Icon
            v-if="selected"
            name="bi:x-lg"
            class="cursor-pointer"
            size="20"
          />
        </li>
      </ComboboxOption>
    </ComboboxOptions>
  </Combobox>
</template>

<script setup lang="ts">
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";

import { GLOBAL_TOPICS, Topic, TopicsTag } from "~/types/topics";

const props = defineProps({
  modelValue: {
    type: Array as PropType<Topic[]>,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const value = computed<Topic[]>({
  get() {
    return props.modelValue;
  },
  set(value: Topic[]) {
    emit("update:modelValue", value);
  },
});

const query = ref("");

const topics = computed((): TopicsTag[] => {
  return [
    ...selectedTopicTags.value,
    ...GLOBAL_TOPICS.filter((topic) => !isActiveTopic(topic.value)),
  ];
});

const selectedTopicTags = computed(() => {
  return value.value
    .map((topic) => {
      return GLOBAL_TOPICS.find((tag) => tag.value === topic);
    })
    .filter((tag) => tag) as TopicsTag[];
});

const filteredTopics = computed(() => {
  return topics.value.filter((topic) => {
    return topic.value.includes(query.value.trim().toLowerCase());
  });
});

function isActiveTopic(topic: Topic) {
  return value.value.includes(topic);
}
</script>

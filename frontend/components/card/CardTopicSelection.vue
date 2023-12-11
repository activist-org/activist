<template v-model="value">
  <div class="flex-col space-y-3 w-full card-style px-5 py-6">
    <label
      for="query"
      class="block font-medium responsive-h3 dark:text-dark-text"
    >
      {{ $t("components.card-topic-selection.header") }}
    </label>
    <input
      v-model="query"
      id="query"
      :display-value="() => query"
      :placeholder="$t('components.card-topic-selection.selector-placeholder')"
      class="pl-4 py-2 w-full text-light-special-text dark:text-dark-special-text bg-light-header dark:bg-dark-header rounded-md elem-shadow-sm"
    />
    <TabGroup
      :selected-index="0"
      manual
      class="flex flex-col gap-2 md:flex-row md:items-center"
    >
      <TabList>
        <Tab
          v-for="topic of filteredTopics"
          @click="selectTopic(topic)"
          @keydown.enter.prevent="selectTopic(topic)"
          v-slot="{ selected }"
          :key="topic.value"
          :value="topic.value"
          multiple
          as="template"
          class="flex justify-between focus:ring-4 items-center gap-2 rounded-lg p-2 border bg-light-btn border-dark-btn font-bold cursor-pointer hover:bg-light-cta-orange-hover hover:dark:bg-dark-cta-orange-hover shadow-sm shadow-zinc-700"
        >
          <div
            :class="{
              'focus:outline focus:outline-blue-400': selected,
              'bg-light-cta-orange dark:bg-dark-cta-orange': isActiveTopic(
                topic.value
              ),
            }"
          >
            <span class="flex items-center gap-2">
              <Icon :name="topic.icon" size="20" />
              {{ $t(topic.label) }}
            </span>
            <Icon
              v-if="isActiveTopic(topic.value)"
              name="bi:x-lg"
              class="cursor-pointer"
              size="20"
            />
          </div>
        </Tab>
      </TabList>
    </TabGroup>
  </div>
</template>

<script setup lang="ts">
import { TabGroup, TabList, Tab } from "@headlessui/vue";

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

const selectTopic = (topic: TopicsTag) => {
  const updatedValue = [...props.modelValue];
  const index = updatedValue.indexOf(topic.value);

  if (index === -1) {
    updatedValue.push(topic.value);
  } else {
    updatedValue.splice(index, 1);
  }
  value.value = updatedValue;
};

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
    .filter((tag) => tag)
    .sort() as TopicsTag[];
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

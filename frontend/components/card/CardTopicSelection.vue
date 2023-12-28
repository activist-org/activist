<template v-model="value">
  <div class="flex-col space-y-3 w-full card-style px-5 py-6">
    <p class="font-medium responsive-h3 text-light-text dark:text-dark-text">
      {{ $t("components.card-topic-selection.header") }}
    </p>
    <input
      v-model="query"
      id="query"
      :display-value="() => query"
      :placeholder="$t('components.card-topic-selection.selector-placeholder')"
      class="pl-4 py-2 w-full text-light-special-text dark:text-dark-special-text bg-light-header dark:bg-dark-header rounded-md elem-shadow-sm focus-brand"
    />
    <TabGroup
      manual
      :defaultIndex="0"
      class="flex flex-col gap-2 md:flex-row md:items-center"
    >
      <TabList>
        <Tab
          v-for="topic of filteredTopics"
          @click="selectTopic(topic)"
          @keydown.enter.prevent="selectTopic(topic)"
          :key="topic.value"
          :value="topic.value"
          multiple
          as="template"
          class="flex justify-between px-4 md:px-2 py-2 gap-2 rounded-lg select-none cursor-pointer elem-shadow-sm"
        >
          <div
            :class="{
              'style-cta': isActiveTopic(topic.value),
              'style-cta-secondary': !isActiveTopic(topic.value),
            }"
          >
            <span class="flex items-center gap-2">
              <Icon :name="topic.icon" size="20" />
              {{ $t(topic.label) }}
            </span>
            <Icon v-if="isActiveTopic(topic.value)" name="bi:x-lg" size="20" />
          </div>
        </Tab>
      </TabList>
    </TabGroup>
  </div>
</template>

<script setup lang="ts">
import { Tab, TabGroup, TabList } from "@headlessui/vue";
import type { Topic, TopicsTag } from "~/types/topics";
import { GLOBAL_TOPICS } from "~/types/topics";

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

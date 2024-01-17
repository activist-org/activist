<template v-model="value">
  <div class="flex-col w-full px-5 py-6 space-y-3 card-style">
    <p class="font-medium responsive-h3 text-light-text dark:text-dark-text">
      {{ $t("components.card-topic-selection.header") }}
    </p>
    <input
      v-model="query"
      @focus="inputFocus = true"
      @keydown.tab.exact.prevent="tabToFirstTopic()"
      id="query"
      :display-value="() => query"
      :placeholder="$t('components.card-topic-selection.selector-placeholder')"
      class="topicInput w-full py-2 pl-4 rounded-md text-light-special-text dark:text-dark-special-text bg-light-header dark:bg-dark-header elem-shadow-sm focus-brand"
    />
    <ul class="hidden gap-2 sm:flex sm:flex-wrap">
      <ShieldTopic
        v-for="(t, index) of filteredTopics"
        @click="selectTopic(t)"
        @keydown.enter.prevent="selectTopic(t)"
        @keydown.tab.prevent="tabToConnect($event)"
        @keydown="keydownEvent(index, $event)"
        :key="t.value"
        :topic="t.label"
        class="topic max-sm:w-full"
        :active="isActiveTopic(t.value)"
        :isSelector="true"
      />
    </ul>
    <ul
      class="flex flex-col gap-2 sm:hidden"
      :class="{
        'pb-2': moreOptionsShown || inputFocus || filteredTopics.length,
      }"
    >
      <ShieldTopic
        v-if="moreOptionsShown || inputFocus"
        v-for="(t, index) of filteredTopics"
        @click="selectTopic(t)"
        @keydown.enter.prevent="selectTopic(t)"
        @keydown.tab.prevent="tabToConnect($event)"
        @keydown="mobileKeyboardEvent(index, $event)"
        :key="t.value + '-selected-only'"
        :topic="t.label"
        class="mobileTopic max-sm:w-full"
        :active="isActiveTopic(t.value)"
        :isSelector="true"
      />
      <ShieldTopic
        v-else
        v-for="(t, index) of selectedTopicTags.sort((a, b) =>
          a.value.localeCompare(b.value)
        )"
        @click="selectTopic(t)"
        @keydown.enter.prevent="selectTopic(t)"
        @keydown.tab.prevent="tabToConnect($event)"
        @keydown="mobileKeyboardEvent(index, $event)"
        :key="t.value"
        :topic="t.label"
        class="mobileTopic max-sm:w-full"
        :active="isActiveTopic(t.value)"
        :isSelector="true"
      />
    </ul>
    <a
      @click="
        moreOptionsShown =
          inputFocus == true ? (moreOptionsShown = false) : !moreOptionsShown;
        inputFocus = false;
      "
      class="cursor-pointer link-text sm:hidden"
    >
      <div v-if="!moreOptionsShown && !inputFocus">
        {{ $t("components.card-topic-selection.view-all-topics") }}
      </div>
      <div v-else>
        {{ $t("components.card-topic-selection.hide-all-topics") }}
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import type { Topic, TopicsTag } from "~/types/topics";
import { GLOBAL_TOPICS } from "~/types/topics";

const props = defineProps({
  modelValue: {
    type: Array as PropType<Topic[]>,
    required: true,
    default: () => [],
  },
});

const moreOptionsShown = ref(false);
const inputFocus = ref(false);
const emit = defineEmits(["update:modelValue"]);

// Tab from topic input to the first topic
const tabToFirstTopic = () => {
  const firstTopic: HTMLElement | null = document.querySelector(".topic");

  firstTopic?.focus();
};

// Tab from topic to T&C checkbox
const tabToConnect = (e: KeyboardEvent) => {
  e.preventDefault();
  const topicInput: HTMLElement | null = document.querySelector(".topicInput");
  const connect: HTMLElement | null = document.querySelector(".connect");

  // Shift-Tab back to topic input from any topic
  if (e.shiftKey) {
    topicInput?.focus();
    return;
  }

  connect?.focus();
};

const keydownEvent = (index: number, e: KeyboardEvent) => {
  e.preventDefault();

  const topics: HTMLElement[] = Array.from(
    document.querySelectorAll(".topic")
  );
  const upTop = topics[index].getBoundingClientRect().top - 38;
  const upLeft = topics[index].getBoundingClientRect().left - 38;

  const upResult = topics.filter(
    (topic) =>
      topic.getBoundingClientRect().top == upTop &&
      topic.getBoundingClientRect().left >= upLeft
  );

  const downTop = topics[index].getBoundingClientRect().top + 38;
  const downLeft = topics[index].getBoundingClientRect().left - 38;

  const downResult = topics.filter(
    (topic) =>
      topic.getBoundingClientRect().top == downTop &&
      topic.getBoundingClientRect().left >= downLeft
  );

  switch (e.code) {
    case "ArrowUp":
      if (upResult.length != 0) {
        upResult[0].focus();
      } else {
        const lastTopicInRow = topics.filter(
          (topic) => topic.getBoundingClientRect().top == upTop
        );
        lastTopicInRow[lastTopicInRow.length - 1].focus();
      }
      break;
    case "ArrowDown":
      if (downResult.length != 0) {
        downResult[0].focus();
      } else {
        const lastTopicInRow = topics.filter(
          (topic) => topic.getBoundingClientRect().top == downTop
        );
        lastTopicInRow[lastTopicInRow.length - 1].focus();
      }
      break;
    case "ArrowLeft":
      topics[index - 1].focus();
      break;
    case "ArrowRight":
      topics[index + 1].focus();
      break;
    case "Enter":
      topics[index - 1]?.focus();
      break;
  }
};

const mobileKeyboardEvent = (index: number, e: KeyboardEvent) => {
  e.preventDefault();

  const topics: HTMLElement[] = Array.from(
    document.querySelectorAll(".mobileTopic")
  );

  switch (e.code) {
    case "ArrowUp":
    case "ArrowLeft":
      e.preventDefault();
      topics[index - 1].focus();
      break;
    case "ArrowDown":
    case "ArrowRight":
      e.preventDefault();
      topics[index + 1].focus();
      break;
    case "Enter":
      topics[index - 1]?.focus();
      break;
  }
};

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

function isActiveTopic(topic: Topic) {
  return value.value.includes(topic);
}

const selectedTopicTags = computed(() => {
  return value.value
    .map((topic) => {
      return GLOBAL_TOPICS.find((tag) => tag.value === topic);
    })
    .filter((tag) => tag) as TopicsTag[];
});

const topics = computed((): TopicsTag[] => {
  return [
    ...selectedTopicTags.value.sort((a, b) => a.value.localeCompare(b.value)),
    ...GLOBAL_TOPICS.filter((topic) => !isActiveTopic(topic.value)).sort(
      (a, b) => a.value.localeCompare(b.value)
    ),
  ];
});

const filteredTopics = computed(() => {
  return topics.value.filter((topic) => {
    return topic.value.includes(query.value.trim().toLowerCase());
  });
});
</script>

<template v-model="value">
  <div class="card-style w-full flex-col space-y-3 px-5 py-6">
    <p class="responsive-h3 font-medium text-light-text dark:text-dark-text">
      {{ $t("components.card-topic-selection.header") }}
    </p>
    <p
      v-if="pageType == 'organization'"
      class="text-light-text dark:text-dark-text"
    >
      {{ $t("components.card-topic-selection.subtext-organization") }}
    </p>
    <p v-if="pageType == 'group'" class="text-light-text dark:text-dark-text">
      {{ $t("components.card-topic-selection.subtext-group") }}
    </p>
    <p
      v-if="pageType == 'resource'"
      class="text-light-text dark:text-dark-text"
    >
      {{ $t("components.card-topic-selection.subtext-resource") }}
    </p>
    <input
      v-model="query"
      @focus="inputFocus = true"
      @keydown="resetTabIndex()"
      id="query"
      :display-value="() => query"
      :placeholder="$t('components.card-topic-selection.selector-placeholder')"
      class="topicInput elem-shadow-sm focus-brand w-full rounded-md bg-light-layer-0 py-2 pl-4 text-light-distinct-text dark:bg-dark-layer-0 dark:text-dark-distinct-text"
    />
    <ul class="hidden gap-2 sm:flex sm:flex-wrap">
      <ShieldTopic
        v-for="t of filteredTopics"
        @click="selectTopic(t)"
        @keydown.enter.prevent="selectTopic(t)"
        @keydown="keydownEvent($event)"
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
        v-for="t of filteredTopics"
        @click="selectTopic(t)"
        @keydown.enter.prevent="selectTopic(t)"
        @keydown="mobileKeyboardEvent($event)"
        :key="t.value + '-selected-only'"
        :topic="t.label"
        class="mobileTopic max-sm:w-full"
        :active="isActiveTopic(t.value)"
        :isSelector="true"
      />
      <ShieldTopic
        v-else
        v-for="t of selectedTopicTags.sort((a, b) =>
          a.value.localeCompare(b.value)
        )"
        @click="selectTopic(t)"
        @keydown.enter.prevent="selectTopic(t)"
        @keydown="mobileKeyboardEvent($event)"
        :key="t.value"
        :topic="t.label"
        class="mobileTopic max-sm:w-full"
        :active="isActiveTopic(t.value)"
        :isSelector="true"
      />
    </ul>
    <button
      @click="
        moreOptionsShown =
          inputFocus == true ? (moreOptionsShown = false) : !moreOptionsShown;
        inputFocus = false;
      "
      class="link-text cursor-pointer sm:hidden"
    >
      <div v-if="!moreOptionsShown && !inputFocus">
        {{ $t("components.card-topic-selection.view-all-topics") }}
      </div>
      <div v-else>
        {{ $t("components.card-topic-selection.hide-all-topics") }}
      </div>
    </button>
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
  pageType: {
    type: String as PropType<"group" | "event" | "organization" | "resource">,
    required: true,
  },
});

const moreOptionsShown = ref(false);
const inputFocus = ref(false);
const emit = defineEmits(["update:modelValue"]);

const resetTabIndex = () => {
  const topic: HTMLElement[] = Array.from(document.querySelectorAll(".topic"));
  const mobileTopic: HTMLElement[] = Array.from(
    document.querySelectorAll(".mobileTopic")
  );

  topic.forEach((topic) => (topic.tabIndex = -1));
  topic[0].tabIndex = 0;
  mobileTopic.forEach((topic) => (topic.tabIndex = -1));
  mobileTopic[0].tabIndex = 0;
};

let index = 0;
const keydownEvent = (e: KeyboardEvent) => {
  const topics: HTMLElement[] = Array.from(document.querySelectorAll(".topic"));

  switch (e.code) {
    case "ArrowUp":
    case "ArrowLeft":
      e.preventDefault();
      if (index > 0) {
        index--;
      } else {
        index = topics.length - 1;
      }
      break;
    case "ArrowDown":
    case "ArrowRight":
      e.preventDefault();
      if (index < topics.length - 1) {
        index++;
      } else {
        index = 0;
      }
      break;
    case "Enter":
      e.preventDefault();
      if (topics[index].classList.contains("style-cta-secondary")) {
        if (index < topics.length - 1) {
          index++;
        }
      } else {
        if (index > 0) {
          index--;
        } else {
          index = 0;
        }
      }
      break;
    case "Tab":
      index = 0;
      break;
  }

  topics.forEach((topic) => (topic.tabIndex = -1));
  topics[index].tabIndex = 0;
  topics[index].focus();
};

const mobileKeyboardEvent = (e: KeyboardEvent) => {
  const topics: HTMLElement[] = Array.from(
    document.querySelectorAll(".mobileTopic")
  );

  switch (e.code) {
    case "ArrowUp":
    case "ArrowLeft":
      e.preventDefault();
      if (index > 0) {
        index--;
      } else {
        index = topics.length - 1;
      }
      break;
    case "ArrowDown":
    case "ArrowRight":
      e.preventDefault();
      if (index < topics.length - 1) {
        index++;
      } else {
        index = 0;
      }
      break;
    case "Enter":
      e.preventDefault();
      if (topics[index].classList.contains("style-cta-secondary")) {
        if (index < topics.length - 1) {
          index++;
        }
      } else {
        if (index > 0) {
          index--;
        } else {
          index = 0;
        }
      }
      break;
    case "Tab":
      index = 0;
      break;
  }

  topics.forEach((topic) => (topic.tabIndex = -1));
  topics[index].tabIndex = 0;
  topics[index].focus();
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

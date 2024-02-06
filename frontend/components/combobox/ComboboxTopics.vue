<template>
  <div class="z-40 flex">
    <Combobox v-model="selectedTopic">
      <div class="relative">
        <div
          class="relative flex w-full overflow-hidden rounded-lg cursor-default elem-shadow-sm focus-brand"
        >
          <ComboboxButton>
            <ComboboxInput
              @change="query = $event.target.value"
              @click="inputFocussed = true"
              @keyup.enter="inputFocussed = false"
              @focus="handleInputFocus"
              @blur="inputFocussed = false"
              class="py-2 pl-4 border rounded-lg style-cta selection:bg-light-highlight dark:selection:bg-white/20"
              :displayValue="displayValueHandler"
            />
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-light-text dark:text-dark-cta-orange"
            >
              <Icon name="bi:chevron-expand" />
            </div>
          </ComboboxButton>
        </div>
        <TransitionRoot
          @after-leave="query = ''"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ComboboxOptions
            id="isVisibleElement"
            class="absolute w-full mt-1 overflow-auto text-base max-h-60 rounded-md bg-light-distinct dark:bg-dark-distinct elem-shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
          >
            <div
              v-if="filteredTopics.length === 0 && query !== ''"
              class="relative px-4 py-2 cursor-default select-none text-light-distinct-text dark:text-dark-distinct-text"
            >
              {{ $t("components.combobox-topics.no-matching-topics") }}
            </div>
            <ComboboxOption
              v-for="topic in filteredTopics"
              @click="inputFocussed = false"
              v-slot="{ selected, active }"
              :key="topic.id"
              as="template"
              :value="topic"
            >
              <li
                class="relative py-2 pl-10 pr-4 cursor-default select-none"
                :class="{
                  'bg-light-cta-orange/80 text-light-text dark:bg-dark-cta-orange/40 dark:text-dark-cta-orange':
                    active,
                  'text-light-text dark:text-dark-text': !active,
                }"
              >
                <span class="block truncate">
                  {{ $t(topic.name) }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{
                    'text-light-text dark:text-dark-cta-orange': active,
                    'text-light-cta-orange dark:text-dark-cta-orange': !active,
                  }"
                >
                  <Icon name="bi:check-lg" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<script setup lang="ts">
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from "@headlessui/vue";
import { GLOBAL_TOPICS } from "~/types/topics";

const i18n = useI18n();

const topics = [{ id: 1, name: "_global.topics.all-topics" }];

let nextId = topics.length + 1;
for (const t of GLOBAL_TOPICS) {
  topics.push({ id: nextId++, name: t.label });
}

const selectedTopic = ref(topics[0]);
const query = ref("");
const inputFocussed = ref(false);

const filteredTopics = computed(() =>
  query.value === ""
    ? topics
    : topics.filter((topic) =>
        topic.name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.value.toLowerCase().replace(/\s+/g, ""))
      )
);

function displayValue() {
  if (inputFocussed.value) {
    return "";
  } else {
    return selectedTopic.value.id == 1
      ? "Filter by topic"
      : selectedTopic.value.name;
  }
}

const displayValueHandler = () => {
  return i18n.t(displayValue());
};

function handleInputFocus(e: Event) {
  // A timeout to make sure the dropdown exist before checking.
  setTimeout(() => {
    const isVisible = document.getElementById("isVisibleElement")?.offsetParent;

    // If the dropdown does not exist, click on the input to trigger it.
    if (!isVisible) {
      const target = e.target as HTMLElement;
      target?.click();
    }
  }, 100);
}
</script>

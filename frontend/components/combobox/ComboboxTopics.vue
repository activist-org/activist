<template>
  <div id="topics-dropdown" class="z-10 flex">
    <Combobox v-model="selectedTopic">
      <div class="relative">
        <div
          class="elem-shadow-sm focus-brand relative flex w-full cursor-default overflow-hidden rounded-lg"
        >
          <ComboboxButton>
            <ComboboxInput
              @change="query = $event.target.value"
              @click="inputFocussed = true"
              @keyup.enter="inputFocussed = false"
              @focus="handleInputFocus"
              @blur="inputFocussed = false"
              class="style-cta rounded-lg border py-2 pl-4 selection:bg-highlight dark:selection:bg-white/20"
              :displayValue="displayValueHandler"
            />
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-text dark:text-cta-orange"
            >
              <Icon :name="IconMap.CHEVRON_EXPAND" />
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
            class="elem-shadow-lg absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-layer-1 text-base ring-1 ring-black/5 focus:outline-none sm:text-sm"
          >
            <div
              v-if="filteredTopics.length === 0 && query !== ''"
              class="relative cursor-default select-none px-4 py-2 text-distinct-text"
            >
              {{ $t("components.combobox_topics.no_matching_topics") }}
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
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-cta-orange/80 text-primary-text dark:bg-cta-orange/40 dark:text-cta-orange':
                    active,
                  'text-primary-text': !active,
                }"
              >
                <span class="block truncate">
                  {{ $t(topic.name) }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{
                    'text-primary-text dark:text-cta-orange': active,
                    'text-cta-orange dark:text-cta-orange': !active,
                  }"
                >
                  <Icon :name="IconMap.CHECK" />
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
import { IconMap } from "~/types/icon-map";
import { GLOBAL_TOPICS } from "~/types/topics";

const i18n = useI18n();

const topics = [{ id: 1, name: "components.combobox_topics.all_topics" }];

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

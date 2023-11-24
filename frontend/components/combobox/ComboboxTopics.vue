<template>
  <div class="flex z-50">
    <Combobox v-model="selectedTopic">
      <div class="relative">
        <div
          class="flex relative w-full cursor-default overflow-hidden rounded-lg elem-shadow-sm focus-brand"
        >
          <ComboboxInput
            @change="query = $event.target.value"
            class="w-full border style-cta py-2 pl-4 rounded-lg"
            :displayValue="(_) => selectedTopic.name"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center pr-2 text-light-text dark:text-dark-cta-orange"
          >
            <Icon name="bi:chevron-expand" />
          </ComboboxButton>
        </div>
        <TransitionRoot
          @after-leave="query = ''"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ComboboxOptions
            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-light-distinct dark:bg-dark-distinct py-1 text-base elem-shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
          >
            <div
              v-if="filteredTopics.length === 0 && query !== ''"
              class="relative cursor-default select-none px-4 py-2 text-light-special-text dark:text-dark-special-text"
            >
              {{ $t("components.combobox-topics.no-matching-topics") }}
            </div>

            <ComboboxOption
              v-for="topic in filteredTopics"
              v-slot="{ selected, active }"
              :key="topic.id"
              as="template"
              :value="topic"
            >
              <li
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-light-cta-orange/80 text-light-text dark:bg-dark-cta-orange/40 dark:text-dark-cta-orange':
                    active,
                  'text-light-text dark:text-dark-text': !active,
                }"
              >
                <span class="block truncate">
                  {{ topic.name }}
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
import { computed, ref } from "vue";

const topics = [
  { id: 1, name: "Filter for all topics" },
  { id: 2, name: "Environment" },
  { id: 3, name: "Animal rights" },
  { id: 4, name: "Racial justice" },
];

const selectedTopic = ref(topics[0]);
const query = ref("");

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
</script>

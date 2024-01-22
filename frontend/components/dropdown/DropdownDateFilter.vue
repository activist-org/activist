<template>
  <div class="flex">
    <Listbox v-model="selectedFilter">
      <div class="relative mt-1">
        <ListboxButton
          class="relative py-2 pl-4 pr-10 text-left rounded-lg cursor-pointer w-36 elem-shadow-sm focus-brand bg-light-menu-selection dark:bg-dark-menu-selection text-light-distinct dark:text-dark-distinct fill-light-distinct dark:fill-dark-distinct sm:text-sm"
        >
          <span class="block truncate">{{ selectedFilter }}</span>
          <span class="absolute inset-y-0 right-0 flex items-center pr-3">
            <Icon name="bi:chevron-expand" />
          </span>
        </ListboxButton>
        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute right-0 py-1 mt-1 overflow-auto text-base shadow-lg max-h-60 w-max rounded-md bg-light-menu-selection dark:bg-dark-menu-selection text-light-distinct dark:text-dark-distinct fill-light-distinct dark:fill-dark-distinct focus-brand ring-1 ring-black/5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-for="option in filterOptions"
              v-slot="{ active, selected }"
              :key="option"
              :value="option"
              class="cursor-pointer"
              as="template"
            >
              <li
                class="relative py-2 pl-10 pr-4 cursor-default select-none"
                :class="{
                  'bg-light-highlight dark:bg-dark-header text-light-cta-orange dark:text-dark-special-text':
                    active,
                  'text-light-distinct dark:text-dark-distinct': !active,
                }"
              >
                <span class="block truncate">{{ option }}</span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-light-cta-orange dark:text-dark-special-text"
                >
                  <Icon name="bi:check-lg" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";

const filterOptions = [
  "Lase week",
  "Last 30 days",
  "Last 60 days",
  "Last year",
];

const selectedFilter = ref(filterOptions[1]);
</script>

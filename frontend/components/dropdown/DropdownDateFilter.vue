<template>
  <div class="flex">
    <Listbox v-model="selectedFilter">
      <div class="relative mt-1">
        <ListboxButton
          class="elem-shadow-sm focus-brand relative w-36 cursor-pointer rounded-lg bg-menu-selection fill-layer-1 py-2 pl-4 pr-10 text-left text-layer-1 sm:text-sm"
        >
          <span class="block truncate">{{ selectedFilter }}</span>
          <span class="absolute inset-y-0 right-0 flex items-center pr-3">
            <Icon :name="IconMap.CHEVRON_EXPAND" />
          </span>
        </ListboxButton>
        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="focus-brand absolute right-0 mt-1 max-h-60 w-max overflow-auto rounded-md bg-menu-selection fill-layer-1 py-1 text-base text-layer-1 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
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
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-highlight text-cta-orange dark:bg-layer-2 dark:text-distinct-text':
                    active,
                  'text-layer-1': !active,
                }"
              >
                <span class="block truncate">{{ option }}</span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-cta-orange dark:text-distinct-text"
                >
                  <Icon :name="IconMap.CHECK" />
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
import { IconMap } from "~/types/icon-map";

const filterOptions = [
  "Last week",
  "Last 30 days",
  "Last 60 days",
  "Last year",
];

const selectedFilter = ref(filterOptions[1]);
</script>

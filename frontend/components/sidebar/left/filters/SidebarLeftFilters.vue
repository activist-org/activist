<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col">
    <div
      class="-my-4 w-full opacity-0"
      :class="{
        'style-cta elem-shadow-sm my-0 flex items-center justify-center rounded-md !opacity-100':
          sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <Icon class="mt-[0.125em]" :name="IconMap.FILTER" size="2em" />
    </div>
    <div
      class="text-primary-text opacity-0 transition"
      :class="{
        '!opacity-100':
          sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      }"
    >
      <template v-for="(filter, key) in filters">
        <div
          v-if="filter.expandable"
          @click="filter.reveal = !filter.reveal"
          @keypress.enter="filter.reveal = !filter.reveal"
          role="button"
          tabindex="0"
          class="mb-2 flex w-fit cursor-pointer items-center"
        >
          <h3 v-if="filter.title" class="font-display text-lg font-bold">
            {{ filter.title }}
          </h3>
          <Icon
            class="my-1 mb-1 ml-4 flex-shrink-0"
            :class="{ 'rotate-180': filter.reveal }"
            :name="IconMap.CHEVRON_DOWN"
            size="1.25em"
          />
        </div>
        <div v-else class="mb-2 flex w-fit items-center">
          <h3 v-if="filter.title" class="font-display text-lg font-bold">
            {{ filter.title }}
          </h3>
        </div>
        <div v-if="!filter.title" class="-mt-4"></div>
        <div class="mb-4">
          <FormRadioGroup
            v-if="filter.type === 'radio'"
            v-model="selectedValues[filter.name]"
            :key="key"
            :options="filter.items"
            :name="filter.name"
            :title="filter.title"
            :style="filter.style"
            :allowCustomValue="filter.allowCustomValue"
          />
          <KeepAlive>
            <FormCheckboxGroup
              v-if="
                (filter.type === 'checkbox' && !filter.reveal) ||
                filter.reveal === false
              "
              v-model="selectedValues[filter.name]"
              :key="key"
              class="mb-1"
              :options="filter.items"
              :name="filter.name"
              :title="filter.title"
              :style="filter.style"
            />
          </KeepAlive>
          <FormSearch
            v-if="filter.type === 'search'"
            v-model="selectedSearchValues[filter.name]"
            :key="key"
            :name="filter.name"
            :placeholder="$t(filter.placeholder)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Filters } from "~/types/filters";
import { IconMap } from "~/types/icon-map";

const sidebar = useSidebar();

interface SelectedValues {
  [key: string]: string | string[];
}

interface SelectedSearchValues {
  [key: string]: [string, number];
}

const props = defineProps({
  filters: {
    type: Object as () => Filters,
    required: true,
  },
});

const filters = ref(props.filters);

const selectedValues: Ref<SelectedValues> = ref({});
const selectedSearchValues: Ref<SelectedSearchValues> = ref({});

watch(selectedValues.value, (newVal) => {
  console.log("selectedValues changed");
  console.log(newVal);

  // TODO: Filter items based on selected filters.
});

watch(selectedSearchValues.value, (newVal) => {
  console.log("selectedSearchValues changed");
  console.log(newVal);

  // TODO: Filter items based on selected filters.
});
</script>

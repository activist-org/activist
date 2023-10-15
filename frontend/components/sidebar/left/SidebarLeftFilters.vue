<template>
  <div class="flex flex-col">
    <div
      class="w-full -my-4 opacity-0"
      :class="{
        '!opacity-100 flex items-center justify-center my-0 text-light-text dark:text-dark-cta-orange transition bg-light-cta-orange/80 dark:bg-dark-cta-orange/20 rounded-md border border-light-text dark:border-dark-cta-orange':
          sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <Icon class="mt-[0.125em]" name="bi:filter" size="2em" />
    </div>
    <div
      class="opacity-0 text-light-text dark:text-dark-text transition"
      :class="{
        '!opacity-100':
          sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      }"
    >
      <template v-for="(filter, key) in filters">
        <div
          v-if="filter.expandable"
          @click="filter.reveal = !filter.reveal"
          class="flex items-center cursor-pointer w-fit mb-2"
        >
          <h3 v-if="filter.title" class="text-lg font-bold font-display">
            {{ filter.title }}
          </h3>
          <Icon
            class="flex-shrink-0 my-1 mb-1 ml-4"
            :class="{ 'rotate-180': filter.reveal }"
            name="bi:chevron-down"
            size="1.25em"
          />
        </div>
        <div v-else class="flex items-center w-fit mb-2">
          <h3 v-if="filter.title" class="text-lg font-bold font-display">
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
            v-model="selectedValues[filter.name]"
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
const sidebar = useSidebar();

import { CheckboxOption } from "../../form/checkbox/FormCheckboxGroup.vue";

interface Filter {
  title: string;
  name: string;
  type: "radio" | "checkbox" | "search";
  items: CheckboxOption[];
  style?: string;
  allowCustomValue?: boolean;
  pageType?: string[];
  searchInput?: boolean;
  placeholder: string;
  expandable?: boolean;
  reveal?: boolean;
}

interface Filters {
  [key: string]: Filter;
}

interface SelectedValues {
  [key: string]: string | string[];
}

const props = defineProps({
  filters: {
    type: Object as () => Filters,
    required: true,
  },
});

const filters = ref(props.filters);

const selectedValues: Ref<SelectedValues> = ref({});

watch(selectedValues.value, (newVal) => {
  console.log("selectedValues changed");
  console.log(newVal);

  // TODO: Filter items based on selected filters.
});
</script>

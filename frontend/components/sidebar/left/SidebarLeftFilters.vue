<template>
  <div class="flex flex-col">
    <div
      class="w-full -my-4 opacity-0"
      :class="{
        '!opacity-100 flex items-center justify-center my-0 text-light-text dark:text-dark-cta-orange transition bg-light-cta-orange/80 dark:bg-dark-cta-orange/20 rounded-md border border-light-text dark:border-dark-cta-orange':
          sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <icon class="mt-[0.125em]" name="bi:filter" size="2em" />
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
          @click="filter.reveal = !filter.reveal"
          class="flex items-center cursor-pointer w-fit"
        >
          <h3 v-if="filter.title" class="mb-2 text-lg font-bold font-display">
            {{ filter.title }}
          </h3>
          <div v-if="filter.expandable">
            <icon
              class="flex-shrink-0 my-1 mb-3 ml-4"
              :class="{ 'rotate-180': filter.reveal }"
              name="bi:chevron-down"
              size="1.25em"
            />
          </div>
        </div>
        <div class="mb-4">
          <formradiogroup
            v-if="filter.type === 'radio'"
            :key="key"
            :options="filter.items"
            :name="filter.name"
            :title="filter.title"
            :style="filter.style"
            :allowCustomValue="filter.allowCustomValue"
            v-model="selectedValues[filter.name]"
          />
          <keep-alive>
            <formcheckboxgroup
              v-if="
                (filter.type === 'checkbox' && !filter.reveal) ||
                filter.reveal === false
              "
              class="mb-1"
              :key="key"
              :options="filter.items"
              :name="filter.name"
              :title="filter.title"
              :style="filter.style"
              v-model="selectedValues[filter.name]"
            />
          </keep-alive>
          <formsearch
            v-if="filter.type === 'search'"
            :key="key"
            :name="filter.name"
            v-model="selectedValues[filter.name]"
            :placeholder="filter.placeholder"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebar = useSidebar();

import { checkboxoption } from "../../form/formcheckboxgroup.vue";

interface filter {
  title: string;
  name: string;
  type: "radio" | "checkbox" | "search";
  items: checkboxoption[];
  style?: string;
  allowCustomValue?: boolean;
  pageType?: string[];
  searchInput?: boolean;
  placeholder?: string;
  expandable?: boolean;
  reveal?: boolean;
}

interface filters {
  [key: string]: filter;
}

interface selectedvalues {
  [key: string]: string | string[];
}

const props = defineProps({
  filters: {
    type: object as () => filters,
    required: true,
  },
});

const filters = ref(props.filters);

const selectedValues: ref<selectedvalues> = ref({});

watch(selectedValues.value, (newVal) => {
  console.log("selectedValues changed");
  console.log(newVal);

  // todo: filter items based on selected filters.
});
</script>

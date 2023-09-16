<template>
  <div
    class="px-3 py-8 opacity-0 text-light-text dark:text-dark-text transition"
    :class="{
      '!opacity-100':
        sidebar.collapsed == false || sidebar.collapsedSwitch == false,
    }"
  >
    <template v-for="(filter, key) in filters">
      <div class="flex items-center">
        <h3 v-if="filter.title" class="mb-3 font-bold responsive-h4">
          {{ filter.title }}
        </h3>
        <div v-if="filter.slide">
          <Icon
            @click="filter.slideUp = !filter.slideUp"
            class="flex-shrink-0 my-1 mb-3 ml-4 cursor-pointer"
            :class="{ 'rotate-180': filter.slideUp }"
            name="bi:chevron-down"
            size="1em"
          />
        </div>
      </div>
      <div>
        <FormRadioGroup
          v-if="filter.type === 'radio'"
          class="mb-6"
          :key="key"
          :options="filter.items"
          :name="filter.name"
          :title="filter.title"
          :style="filter.style"
          :allowCustomValue="filter.allowCustomValue"
          v-model="selectedValues[filter.name]"
        />
        <keep-alive>
          <FormCheckboxGroup
            v-if="
              (filter.type === 'checkbox' && !filter.slideUp) ||
              filter.slideUp === false
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
        <FormSearch
          v-if="filter.type === 'search'"
          class="mb-6"
          :key="key"
          :name="filter.name"
          v-model="selectedValues[filter.name]"
          :placeholder="filter.placeholder"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const sidebar = useSidebar();
import { Ref, ref, watch } from "vue";

interface FilterOption {
  label: string;
  value: string;
}

interface Filter {
  title: string;
  name: string;
  type: "radio" | "checkbox" | "search";
  items: FilterOption[];
  style?: string;
  allowCustomValue?: boolean;
  pageType?: string[];
  searchInput?: boolean;
  placeholder?: string;
  slide?: boolean;
  slideUp?: boolean;
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

  // TODO: Filters items based on selected filters.
});
</script>

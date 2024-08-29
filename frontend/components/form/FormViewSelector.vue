<template>
  <RadioGroup
    v-model="value"
    class="flex h-11 w-full items-center divide-x-2 divide-light-text dark:divide-dark-text"
    :aria-label="$t('components.form_view_selector.title_aria_label')"
  >
    <RadioGroupOption
      v-for="option in viewOptions"
      :key="option"
      v-slot="{ checked }"
      :name="option"
      :value="option"
      as="template"
    >
      <button
        class="h-full flex-1 border-y-2 border-light-text first:rounded-l-xl first:border-l-2 last:rounded-r-xl last:!border-r-2 dark:border-dark-text"
        :class="
          checked
            ? 'bg-light-menu-selection dark:bg-dark-menu-selection'
            : 'bg-light-layer-0 dark:bg-dark-layer-0'
        "
        :aria-label="$t(viewAriaLabelsDict[option])"
      >
        <Icon
          class="h-full w-auto p-2"
          :class="
            checked
              ? 'text-dark-text dark:text-light-text'
              : 'text-light-text dark:text-dark-text'
          "
          :name="viewTypeIcons[option]"
        />
      </button>
    </RadioGroupOption>
  </RadioGroup>
</template>

<script setup lang="ts">
import { RadioGroup, RadioGroupOption } from "@headlessui/vue";
import { ViewType } from "~/types/view-types";

const props = defineProps({
  modelValue: {
    type: String as PropType<ViewType>,
    required: true,
  },
  option1: {
    type: String as PropType<ViewType>,
    required: true,
  },
  option2: {
    type: String as PropType<ViewType>,
    required: true,
  },
  option3: {
    type: String as PropType<ViewType>,
    required: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value: ViewType) {
    emit("update:modelValue", value);
  },
});

const viewOptions = computed(() => {
  const options = [props.option1, props.option2];
  if (props.option3) {
    options.push(props.option3);
  }
  return options;
});

// Dictionary is used to assure that the full keys are present and picked up by the i18n checks.
const viewAriaLabelsDict = {
  map: "components.form_view_selector.view_as_map_aria_label",
  list: "components.form_view_selector.view_as_list_aria_label",
  calendar: "components.form_view_selector.view_as_calendar_aria_label",
  grid: "components.form_view_selector.view_as_grid_aria_label",
};

const viewTypeIcons: Record<ViewType, string> = {
  [ViewType.MAP]: "bi-pin-map-fill",
  [ViewType.LIST]: "bi-list-ul",
  [ViewType.GRID]: "bi-grid-3x2-gap-fill",
  [ViewType.CALENDAR]: "bi-calendar-date",
};
</script>

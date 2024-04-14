<template>
  <RadioGroup
    v-model="value"
    class="flex h-11 w-full items-center divide-x-2 divide-dark-btn dark:divide-light-btn"
    :aria-label="$t('components.view-selector.title-aria-label')"
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
        class="h-full flex-1 border-y-2 border-dark-btn first:rounded-l-xl first:border-l-2 last:rounded-r-xl last:!border-r-2 dark:border-light-btn"
        :class="
          checked
            ? 'bg-dark-btn dark:bg-light-btn'
            : 'bg-white dark:bg-dark-btn'
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
  map: "components.view-selector.view-as-map-aria-label",
  list: "components.view-selector.view-as-list-aria-label",
  calendar: "components.view-selector.view-as-calendar-aria-label",
  grid: "components.view-selector.view-as-grid-aria-label",
};

const viewTypeIcons: Record<ViewType, string> = {
  [ViewType.MAP]: "bi-pin-map-fill",
  [ViewType.LIST]: "bi-list-ul",
  [ViewType.GRID]: "bi-grid-3x2-gap-fill",
  [ViewType.CALENDAR]: "bi-calendar-date",
};
</script>

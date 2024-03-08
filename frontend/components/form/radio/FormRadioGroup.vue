<template>
  <div class="flex w-full">
    <div v-show="!showAdditionalInput" class="flex w-full">
      <component
        v-for="option in options"
        @update:modelValue="updateValue(option.value)"
        :is="radioComponent"
        :key="option.value"
        class="flex-1 border-r-0"
        :class="{
          'last:border-r': !allowCustomValue,
          'last:rounded-r-none': allowCustomValue,
        }"
        :name="name"
        :label="option.label"
        :value="option.value"
        :modelValue="modelValue"
        :customColor="option.customColor"
      />
    </div>
    <div v-if="allowCustomValue" class="flex flex-1 w-full">
      <input
        v-if="showAdditionalInput"
        v-model="customValue"
        @input="inputDebounce"
        class="flex-1 w-full pl-4 pr-2 font-bold border border-r-0 outline-none border-light-interactive rounded-l-md bg-light-layer-2 dark:bg-dark-layer-2 dark:border-dark-interactive text-light-distinct-text dark:text-dark-distinct-text"
        :type="customValueType"
        :placeholder="
          $t('components.form-radio-group.custom-numeric-value-placeholder')
        "
      />
      <button
        @click="toggleAdditionalInput"
        class="rounded-r-md relative min-w-[3rem] h-9 border border-light-interactive dark:border-dark-interactive focus-brand"
        :class="{
          'bg-light-layer-2 text-light-distinct-text dark:bg-dark-layer-2 dark:text-dark-distinct-text':
            !showAdditionalInput,
          'bg-light-menu-selection text-light-layer-1 dark:bg-dark-menu-selection dark:text-dark-layer-1':
            showAdditionalInput,
        }"
      >
        <Icon v-if="!showAdditionalInput" name="bi:hash" size="1.5em" />
        <Icon v-else name="bi:x-lg" size="1.35em" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

// TODO: This type should be defined for the props definition type from FromRadioButton and FromRadio.
/**
 * The available radio type option.
 */
export type RadioOption = {
  /**
   * The radio label.
   */
  label: string;

  /**
   * The radio value.
   */
  value: string;

  /**
   * The optional radio button custom color.
   */
  customColor?: string;
};

export interface Props {
  name: string;
  options: RadioOption[];
  vertical?: boolean;
  modelValue: string | string[];
  allowCustomValue?: boolean;
  customValueType?: string;
  style?: string;
}

const props = withDefaults(defineProps<Props>(), {
  vertical: false,
  allowCustomValue: false,
  customValueType: "number",
  style: "btn",
});

const emit = defineEmits(["update:modelValue"]);

const radioComponent = computed(() => {
  return props.style === "btn" ? "FormRadioBtn" : "FormRadio";
});

const {
  updateValue,
  customValue,
  showAdditionalInput,
  inputDebounce,
  toggleAdditionalInput,
} = useFormCheckboxRadio(props.modelValue, emit);
</script>

<template>
  <div class="flex w-full">
    <div class="flex w-full" v-show="!showAdditionalInput">
      <component
        v-for="option in options"
        @update:modelValue="updateValue(option.value)"
        class="flex-1 border-r-0"
        :class="{
          'last:border-r': !allowCustomValue,
          'last:rounded-r-none': allowCustomValue,
        }"
        :key="option.value"
        :is="radioComponent"
        :name="name"
        :label="option.label"
        :modelValue="modelValue"
        :value="option.value"
        :customColor="option.customColor"
      />
    </div>
    <div v-if="allowCustomValue" class="flex flex-1 w-full">
      <input
        v-if="showAdditionalInput"
        @input="inputDebounce"
        class="font-bold pl-5 pr-2 w-full outline-none flex-1 border border-light-interactive border-r-0 rounded-l-md bg-light-header dark:bg-dark-header dark:border-dark-interactive text-light-special-text dark:text-dark-special-text"
        :type="customValueType"
        v-model="customValue"
        :placeholder="customValuePlaceholder"
      />
      <button
        @click="toggleAdditionalInput"
        class="rounded-r-md relative min-w-[3rem] h-10 border border-light-interactive bg-light-header text-light-interactive dark:bg-dark-header dark:border-dark-interactive dark:text-dark-special-text"
      >
        <Icon v-if="!showAdditionalInput" name="bi:hash" size="1.5em" />
        <Icon v-else name="bi:x-lg" size="1.35em" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import useFormCheckboxRadio from "../../composables/useFormCheckboxRadio";

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
}

const props = defineProps({
  vertical: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Array] as PropType<string | string[]>,
    required: true,
  },
  options: {
    type: Array as PropType<RadioOption[]>,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  allowCustomValue: {
    type: Boolean,
    default: false,
  },
  customValueType: {
    type: String,
    default: "number",
  },
  customValuePlaceholder: {
    type: String,
    default: "",
  },
  style: {
    type: String,
    default: "button",
  },
});

const emit = defineEmits(["update:modelValue"]);

const radioComponent = computed(() => {
  return props.style === "button" ? "FormRadioButton" : "FormRadio";
});

const {
  updateValue,
  customValue,
  showAdditionalInput,
  inputDebounce,
  toggleAdditionalInput,
} = useFormCheckboxRadio(props.modelValue, emit);
</script>

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
        class="flex-1 w-full pl-5 pr-2 font-bold border border-r-0 outline-none border-light-interactive rounded-l-md bg-light-header dark:bg-dark-header dark:border-dark-interactive text-light-special-text dark:text-dark-special-text"
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
};

export interface Props {
  vertical?: boolean;
  modelValue: string | string[];
  options: RadioOption[];
  name: string;
  allowCustomValue?: boolean;
  customValueType?: string;
  customValuePlaceholder?: string;
  style?: string;
}

const props = withDefaults(defineProps<Props>(), {
  vertical: false,
  allowCustomValue: false,
  customValueType: "number",
  customValuePlaceholder: "",
  style: "button",
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

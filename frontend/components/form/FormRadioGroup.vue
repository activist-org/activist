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
        <icon v-if="!showAdditionalInput" name="bi:hash" size="1.5em" />
        <icon v-else name="bi:x-lg" size="1.35em" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import useFormCheckboxRadio from "../../composables/useFormCheckboxRadio";

// todo: this type should be defined for the props definition type from fromradiobutton and fromradio.
/**
 * the available radio type option.
 */
export type radiooption = {
  /**
   * the radio label.
   */
  label: string;

  /**
   * the radio value.
   */
  value: string;

  /**
   * the optional radio button custom color.
   */
  customColor?: string;
};

const props = defineProps({
  vertical: {
    type: boolean,
    default: false,
  },
  modelValue: {
    type: [string, array] as proptype<string | string[]>,
    required: true,
  },
  options: {
    type: array as proptype<radiooption[]>,
    required: true,
  },
  name: {
    type: string,
    required: true,
  },
  allowCustomValue: {
    type: boolean,
    default: false,
  },
  customValueType: {
    type: string,
    default: "number",
  },
  customValuePlaceholder: {
    type: string,
    default: "",
  },
  style: {
    type: string,
    default: "button",
  },
});

const emit = defineEmits(["update:modelValue"]);

const radioComponent = computed(() => {
  return props.style === "button" ? "formradiobutton" : "formradio";
});

const {
  updateValue,
  customValue,
  showAdditionalInput,
  inputDebounce,
  toggleAdditionalInput,
} = useFormCheckboxRadio(props.modelValue, emit);
</script>

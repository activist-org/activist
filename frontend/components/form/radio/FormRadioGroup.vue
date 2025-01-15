<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
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
    <div v-if="allowCustomValue" class="flex w-full flex-1">
      <label
        v-if="showAdditionalInput"
        :for="customValueType"
        class="sr-only"
        >{{
          $t("components.form_radio_group.custom_numeric_value_placeholder")
        }}</label
      >
      <input
        v-if="showAdditionalInput"
        v-model="customValue"
        @input="inputDebounce"
        :id="customValueType"
        class="w-full flex-1 rounded-l-md border border-r-0 border-interactive bg-layer-2 pl-4 pr-2 font-bold text-distinct-text outline-none"
        :type="customValueType"
        :placeholder="
          $t('components.form_radio_group.custom_numeric_value_placeholder')
        "
      />
      <button
        @click="toggleAdditionalInput"
        class="focus-brand relative h-9 min-w-[3rem] rounded-r-md border border-interactive"
        :class="{
          'bg-layer-2 text-distinct-text': !showAdditionalInput,
          'bg-menu-selection text-layer-1': showAdditionalInput,
        }"
      >
        <Icon v-if="!showAdditionalInput" :name="IconMap.HASH" size="1.5em" />
        <Icon v-else :name="IconMap.X_LG" size="1.35em" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IconMap } from "~/types/icon-map";

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

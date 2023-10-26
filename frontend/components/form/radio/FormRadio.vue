<template>
  <input
    v-bind="{ ...$attrs, onChange: updateValue }"
    :id="uuid"
    class="field"
    :checked="modelValue === value"
    type="radio"
  />
  <label v-if="label" :for="uuid">
    {{ label }}
  </label>
  <BaseErrorMessage v-if="error" :id="`${uuid}-error`">
    {{ error }}
  </BaseErrorMessage>
</template>

<script setup lang="ts">
// @ts-nocheck
import { v4 as uuidv4 } from "uuid";
import useFormInput from "~/composables/useFormSetup";

export interface Props {
  label?: string;
  modelValue?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  error: "",
});

const emit = defineEmits(["update:modelValue"]);
const { updateValue } = useFormInput(props, emit);
const uuid = uuidv4();
</script>

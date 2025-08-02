<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormTextInput
    @update:modelValue="$emit('update:modelValue', $event)"
    @input="$emit('input', $event)"
    @blur="$emit('blur', $event)"
    :id="id"
    :label="label"
    :hasError="hasError"
    :type="isPassword ? 'password' : 'text'"
    :modelValue="modelValue"
  >
    <template #icons>
      <slot name="icons"></slot>
      <button
        @click="changeInputType"
        @mousedown.prevent
        :id="`${id}-show-password`"
        type="button"
      >
        <Icon
          :name="isPassword ? IconMap.VISIBLE : IconMap.HIDDEN"
          size="1.4em"
        />
      </button>
    </template>
  </FormTextInput>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

export interface Props {
  id: string;
  label: string;
  hasError?: boolean;
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  hasError: false,
  modelValue: "",
});

defineEmits<{
  (e: "update:modelValue" | "input", value: string): void;
  (e: "blur", event: FocusEvent): void;
}>();

const isPassword = ref<boolean>(true);

const changeInputType = () => {
  isPassword.value = !isPassword.value;
};

// Reset to password type when value is cleared
watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      isPassword.value = true;
    }
  }
);

// Reset password visibility before form submission
onMounted(() => {
  const inputElement = document.getElementById(props.id);
  const form = inputElement?.closest("form");
  if (form) {
    form.addEventListener("submit", () => {
      isPassword.value = true;
    });
  }
});
</script>

<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormTextInput
    :id="id"
    :label="label"
    :hasError="hasError"
    :type="isPassword ? 'password' : 'text'"
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @input="$emit('input', $event)"
    @blur="$emit('blur', $event)"
    @keydown.enter="handleEnterKey"
  >
    <template #icons>
      <slot name="icons"></slot>
      <button
        type="button"
        @click="changeInputType"
        :id="`${id}-show-password`"
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
  (e: "update:modelValue", value: string): void;
  (e: "input", value: string): void;
  (e: "blur", event: FocusEvent): void;
}>();

const isPassword = ref<boolean>(true);

const changeInputType = () => {
  isPassword.value = !isPassword.value;
};

const handleEnterKey = () => {
  // Ensure password stays hidden when Enter is pressed
  isPassword.value = true;
};

// Reset to password type when value changes or component unmounts
watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      isPassword.value = true;
    }
  }
);

// Force password type on any form submission attempt
onMounted(() => {
  const form = document.getElementById(props.id)?.closest("form");
  if (form) {
    form.addEventListener("submit", () => {
      isPassword.value = true;
    });
  }
});

onUnmounted(() => {
  isPassword.value = true;
});
</script>

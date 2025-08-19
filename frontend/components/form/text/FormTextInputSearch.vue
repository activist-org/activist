<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormTextInput
    @update:modelValue="(val) => (localValue = val)"
    :id="id"
    :label="label"
    :modelValue="localValue"
    iconLocation="left"
  >
    <template #icons>
      <slot name="icons"></slot>
      <button :id="`${id}-search`" type="button">
        <Icon :name="IconMap.SEARCH" size="1.4em" />
      </button>
    </template>
  </FormTextInput>
</template>

<script setup lang="ts">
import { useDebounce } from "~/composables/useDebounce";
import { IconMap } from "~/types/icon-map";

export interface Props {
  id: string;
  label: string;
  hasError?: boolean;
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  hasError: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const localValue = ref(props.modelValue || "");

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== localValue.value) {
      localValue.value = newVal ?? "";
    }
  }
);

// Create one debounced function instance only.
const { debounce } = useDebounce();
const emitDebouncedUpdate = debounce((value: unknown) => {
  emit("update:modelValue", value as string);
}, 300);
watch(localValue, (newVal) => {
  emitDebouncedUpdate(newVal);
});
</script>

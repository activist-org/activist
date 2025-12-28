<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
    <div class="flex" :class="{ 'flex-col gap-2': vertical }">
      <FormRadioBtn
        v-for="option in options"
        :key=" typeof option.value === 'string' || typeof option.value === 'number' ? option.value : option.value.id"
        @update:model-value="updateValue"
        :custom-color="option.customColor || customColor"
        :label="option.label"
        :model-value="modelValue"
        :value="option.value"
      />
    </div>
</template>

<script setup lang="ts">

export interface Props {
  label?: string;
  options: RadioOption[];
  modelValue?: string;
  error?: string;
  customColor?: string;
  vertical?: boolean;
}

withDefaults(defineProps<Props>(), {
  vertical: false,
});

const emit = defineEmits(["update:modelValue"]);
const updateValue = (value: unknown) => {
  emit("update:modelValue", value);
};
</script>

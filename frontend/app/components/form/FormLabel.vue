<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex items-center space-x-1">
    <label :for="props.for" class="text-base font-semibold text-primary-text">
      {{ label }}
    </label>
    <span v-if="required" class="text-action-red">*</span>
  </div>
</template>

<script setup lang="ts">
export interface LabelFormProps {
  for: string;
  label: string;
  required?: boolean;
}

const props = withDefaults(defineProps<LabelFormProps>(), {
  required: false,
});
</script>

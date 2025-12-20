<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex items-center space-x-1">
    <label class="text-base font-semibold text-primary-text" :for="props.for">
      {{ label }}
    </label>
    <span
      v-if="required"
      class="text-action-red"
      data-testid="required field indicator"
    >
      *
    </span>
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

<template>
  <div class="flex items-center space-x-2">
    <label
      :for="props.for"
      class="dark:text-primary-text-dark text-sm font-semibold text-primary-text"
    >
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

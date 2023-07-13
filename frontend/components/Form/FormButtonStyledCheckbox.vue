<template>
    <div :class="['text-xl font-bold relative min-w-[3.4rem] h-11 min-h-[2.75rem] border border-light-interactive dark:border-dark-interactive border-r-0 last:border-r bg-light-header text-light-special-text dark:text-dark-special-text dark:bg-dark-header first:rounded-l-md last:rounded-r-md', { 'bg-dark-header dark:bg-dark-menu-selection text-dark-interactive dark:text-dark-distinct border-dark-header dark:border-light-header': modelValue }]">
      <input
        type="checkbox"
        v-bind="{ ...$attrs, onChange: updateValue }"
        :checked="modelValue"
        :id="uuid"
        class="hidden"
      />
      <label v-if="label" :for="uuid" class="min-h-[2.75rem] absolute w-full h-full flex items-center justify-center cursor-pointer">
        {{ label }}
      </label>
    </div>
    </template>
  
  <script setup>
  import useUniqueID from "@/composables/useUniqueID";
  import useFormInput from '@/composables/useFormSetup';
  const props = defineProps({
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number, Boolean]
    },
    value: {
      type: [String, Number]
    },
    error: {
      type: String,
      default: ''
    }
  });
  const emit = defineEmits(['update:modelValue']);
  const { updateValue } = useFormInput(props,  emit);
  const uuid = useUniqueID().getID();
  
  </script>
  
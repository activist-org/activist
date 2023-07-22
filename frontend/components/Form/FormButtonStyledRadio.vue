<template>
  <div :class="['text-xl font-bold relative min-w-[3.4rem] min-h-[2.75rem]  h-11 first:rounded-l-md last:rounded-r-md border border-light-interactive dark:border-dark-interactive bg-light-header text-light-special-text dark:text-dark-special-text dark:bg-dark-header', { 'bg-dark-header dark:bg-dark-menu-selection text-dark-interactive dark:text-dark-distinct border-dark-header ': modelValue === value, [customColorClass]: modelValue === value  }]">
    <input
      type="radio"
      v-bind="{ ...$attrs, onChange: updateValue }"
      :checked="modelValue === value"
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
    },
    customColor: {  
      type: String,
    },
  });
  const emit = defineEmits(['update:modelValue']);
  const { updateValue } = useFormInput(props,  emit);
  const uuid = useUniqueID().getID();
  const customColorClass = props.customColor ? `text-white border-light-${props.customColor} dark:border-dark-${props.customColor} dark:bg-dark-${props.customColor} bg-light-${props.customColor}` : '';
  
  </script>
  
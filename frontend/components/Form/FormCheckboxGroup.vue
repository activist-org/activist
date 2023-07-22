<template>
  <div class="flex w-full flex-wrap" :class="{ 'flex-col': checkboxComponent === 'FormCheckbox' }">
    <component :class="{ 'flex-1': checkboxComponent !== 'FormCheckbox' }" v-for="option in options" :key="option.value"
      :is="checkboxComponent" :label="option.label" :modelValue="isSelected(option.value)" :value="option.value"
      @update:modelValue="toggleCheckbox(option.value)" />
  </div>
</template>
  
<script setup>
import useFormCheckboxRadio from '@/composables/useFormCheckboxRadio';

const props = defineProps({
  modelValue: {
    type: Array,
    required: false,
  },
  options: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    default: 'button',
  },
  searchInput: {
    type: Boolean,
    default: false,
  },
});

const checkboxComponent = computed(() => {
  return props.style === 'button'
    ? 'FormButtonStyledCheckbox'
    : 'FormCheckbox';
});

const emit = defineEmits(['update:modelValue']);

const {
  isSelected,
  toggleCheckbox
} = useFormCheckboxRadio(props, emit);

</script>
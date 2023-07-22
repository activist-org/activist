
<template>
  <div class="flex w-full">
    <div class="flex w-full" v-show="!showAdditionalInput">
      <component v-for="opts in options" :key="opts.value" :is="radioComponent" :name="name" :label="opts.label"
        :modelValue="modelValue" :value="opts.value" :customColor="opts.customColor"
        @update:modelValue="updateValue(opts.value)" class="border-r-0 flex-1"
        :class="{ 'last:border-r': !allowCustomValue, 'last:rounded-r-none': allowCustomValue }" />
    </div>
    <div class="flex w-full flex-1" v-if="allowCustomValue">
      <input v-if="showAdditionalInput" :type=customValueType v-model="customValue" @input="inputDebounce"
        :placeholder="customValuePlaceholder"
        class="font-bold px-5 md:max-w-[10.5rem] outline-none flex-1 border border-light-interactive border-r-0  rounded-l-md  bg-light-header dark:bg-dark-header border-light-special-text dark:border-dark-interactive text-light-special-text dark:text-dark-special-text" />
      <button
        class="rounded-r-md text-xl font-bold relative min-w-[3.4rem] h-11 border border-light-interactive bg-light-header text-light-interactive dark:bg-dark-header dark:border-dark-interactive dark:text-dark-special-text"
        @click="toggleAdditionalInput">
        #
      </button>
    </div>
  </div>
</template>
  
<script setup>
import { computed } from 'vue';
import useFormCheckboxRadio from '@/composables/useFormCheckboxRadio';

const props = defineProps({
  vertical: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Number],
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
  allowCustomValue: {
    type: Boolean,
    default: false,
  },
  customValueType: {
    type: String,
    default: 'number',
  },
  customValuePlaceholder: {
    type: String,
    default: '',
  },
  style: {
    type: String,
    default: 'button',
  },
});

const emit = defineEmits(['update:modelValue']);

const radioComponent = computed(() => {
  return props.style === 'button'
    ? 'FormButtonStyledRadio'
    : 'FormRadio';
});

const {
  updateValue,
  customValue,
  showAdditionalInput,
  inputDebounce,
  toggleAdditionalInput,
} = useFormCheckboxRadio(props, emit);

</script>

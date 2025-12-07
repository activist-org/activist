<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <RadioGroup
    v-model="value"
    :aria-label="$t('i18n.components.form_selector_radio.title_aria_label')"
    class="flex h-10 w-full px-1"
  >
    <RadioGroupOption
      v-for="(option, idx) in options"
      :key="option.key"
      @click.capture="onOptionClick($event, option)"
     
      :aria-label="$t(option.aria_label)"
      class="flex flex-1 cursor-pointer items-center justify-center rounded-none"
      :class="[
        {
          'style-menu-option-cta': isOptionChecked(option),
          'style-menu-option bg-layer-2': !isOptionChecked(option),
          'rounded-l-lg': idx === 0,
          'rounded-r-lg': idx === options.length - 1,
        },
        option.class,
        {
          [option.checkedClass || '']: isOptionChecked(option),
        },
      ]"
      :name="option.label || ''"
      :value="option.value"
    >
      <Icon
        v-if="option.isIcon"
        :aria-hidden="true"
        class="h-6 w-6"
        :name="option.content as string"
      />
      <span v-else class="text-sm font-medium" :class="option.class">
        {{ option.content }}
      </span>
    </RadioGroupOption>
  </RadioGroup>
</template>

<script setup lang="ts">
import { RadioGroup, RadioGroupOption } from "@headlessui/vue";

type Option = {
  value: string | number | boolean | Record<string, unknown> | undefined;
  key: string;
  content: HTMLElement | string;
  aria_label: string;
  label?: string;
  isIcon?: boolean;
  class?: string;
  checkedClass?: string;
};

const props = defineProps<{
  modelValue: string | number | boolean | Record<string, unknown> | undefined;
  options: Option[];
  toggleable?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: typeof props.modelValue): void;
}>();

const value = computed({
  get: () => props.modelValue,
  set: (val) => {
     emit("update:modelValue", val);
  },
});

const isOptionChecked = (option: Option) => {
  return value.value === option.value;
};

const onOptionClick = (e: MouseEvent, option: Option) => {
  if (!props.toggleable) return;
  
  // Always prevent HeadlessUI from handling toggleable radio buttons
  e.stopPropagation();
  e.preventDefault();
  
  if (isOptionChecked(option)) {
    // Toggle off: emit undefined
    emit("update:modelValue", undefined);
  } else {
    // Select: emit the option value
    emit("update:modelValue", option.value);
  }
};


</script>

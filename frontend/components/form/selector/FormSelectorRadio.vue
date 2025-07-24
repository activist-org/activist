<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <RadioGroup
    v-model="value"
    class="flex h-10 w-full px-1"
    :aria-label="$t('i18n.components.form_selector_radio.title_aria_label')"
  >
    <RadioGroupOption
      v-for="(option, idx) in options"
      :key="option.key"
      v-slot="{ checked }"
      class="flex flex-1"
      :name="option.label || ''"
      :value="option.value"
    >
      <button
        class="flex-1 rounded-none"
        :class="{
          'style-menu-option-cta': checked,
          'style-menu-option bg-layer-2': !checked,
          'rounded-l-lg': idx === 0,
          'rounded-r-lg': idx === options.length - 1,
        }"
        :aria-label="$t(option.aria_label)"
      >
        <Icon
          :name="option.content as string"
          class="h-6 w-6"
          :aria-hidden="true"
        />
      </button>
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
};

const props = defineProps<{
  modelValue: string | number | boolean | Record<string, unknown> | undefined;
  options: Option[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: typeof props.modelValue): void;
}>();

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

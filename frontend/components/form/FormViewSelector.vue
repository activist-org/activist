<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <RadioGroup
    v-model="value"
    class="flex h-11 w-full justify-around divide-primary-text"
    :aria-label="$t('i18n.components.form_view_selector.title_aria_label')"
  >
    <RadioGroupOption
      v-for="option in options"
      :key="option.key"
      v-slot="{ checked }"
      class="flex flex-1 items-center justify-center gap-2"
      :name="option.label || ''"
      :value="option.value"
    >
      <button
        v-if="option.isIcon"
        class="h-full flex-1"
        :class="checked ? 'style-menu-option-cta' : 'style-menu-option'"
        :aria-label="$t(option.aria_label)"
      >
        <Icon
          :name="option.content as string"
          class="h-6 w-6"
          :aria-hidden="true"
        />
      </button>
      {{ !option.isIcon ? option.content : "" }}
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

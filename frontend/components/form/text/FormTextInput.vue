<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<!-- Note: Based on Material-UI text input styling. -->
<!-- See: https://mui.com/material-ui/react-text-field/ -->
<template>
  <div
    class="primary-text relative inline-flex w-full flex-col space-y-2 align-top"
  >
    <label
      class="z-1 absolute"
      :class="{
        'translate-x-4 text-sm text-distinct-text': shrinkLabel,
        'translate-y-[1.125rem] pl-[12px]':
          !shrinkLabel && iconLocation === 'right',
        'translate-y-[1.125rem] pl-[3.4rem]':
          !shrinkLabel && iconLocation === 'left',
      }"
      :for="id"
    >
      {{ label }}
    </label>
    <div
      class="border-box relative inline-flex select-none items-center overflow-hidden text-left text-distinct-text"
    >
      <span
        v-if="$slots.icons && iconLocation === 'left'"
        class="flex items-center gap-2 px-[10px]"
      >
        <slot name="icons"></slot>
      </span>
      <input
        @input="
          (e) => emit('update:modelValue', (e.target as HTMLInputElement).value)
        "
        @focus="shrinkLabel = true"
        @blur="handleBlur"
        :id="id"
        class="box-content h-5 w-full bg-transparent py-3 pl-[12px] pr-[10px] text-primary-text placeholder-distinct-text outline-none"
        type="text"
        :placeholder="shrinkLabel ? '' : label"
        :value="modelValue"
        v-bind="$attrs"
      />
      <span
        v-if="$slots.icons && iconLocation === 'right'"
        class="flex items-center gap-2 px-[10px]"
      >
        <slot name="icons"></slot>
      </span>

      <!-- Using a fieldset allows the label to overlay the border. -->
      <fieldset
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 -top-[5px] bottom-0 rounded border pl-[12px] pr-[10px]"
        :class="{
          'border-action-red dark:border-action-red': hasError,
          'border-interactive': !hasError,
        }"
        :data-testid="`${id}-border`"
      >
        <legend
          class="invisible h-3 text-sm"
          :class="{ 'max-w-[0.01px]': !shrinkLabel }"
          data-testid="hidden-legend"
        >
          <!-- This span overlays the border when expanded. -->
          <span class="visible px-1 opacity-0">
            {{ label }}
          </span>
        </legend>
      </fieldset>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

export interface Props {
  id: string;
  label: string;
  modelValue?: string;
  hasError?: boolean;
  iconLocation?: "left" | "right";
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  hasError: false,
  iconLocation: "right",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
const shrinkLabel = ref<boolean>(!!props.modelValue);

const handleBlur = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement | null;
  if (!target?.value) {
    shrinkLabel.value = false;
  }
};

watch(
  () => props.modelValue,
  (value) => {
    shrinkLabel.value = !!value;
  }
);
</script>

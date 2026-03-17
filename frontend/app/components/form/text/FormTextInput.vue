<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<!-- Note: Based on Material-UI text input styling. -->
<!-- See: https://mui.com/material-ui/react-text-field/ -->
<template>
  <div
    class="form-text-input-container primary-text relative inline-flex w-full flex-col space-y-2 align-top"
  >
    <label
      class="form-text-input-label pointer-events-none absolute z-10"
      :class="{
        '-translate-y-2 translate-x-4 text-sm text-distinct-text':
          shrinkLabel && iconLocation === 'right',
        '-translate-y-2 translate-x-[3.4rem] text-sm text-distinct-text':
          shrinkLabel && iconLocation === 'left',
        'text-primary-text': !shrinkLabel,
        'translate-y-[0.6rem] pl-3': !shrinkLabel && iconLocation === 'right',
        'translate-y-[0.6rem] pl-[3.4rem]':
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
        class="flex items-center gap-2 px-2.5"
      >
        <slot name="icons"></slot>
      </span>
      <input
        :id="id"
        ref="inputRef"
        @animationstart="handleAnimationStart"
        @blur="handleBlur"
        @change="handleChange"
        @focus="handleFocus"
        @input="handleInput"
        @pointerdown="handlePointerDown"
        class="form-text-input box-content h-5 w-full bg-transparent py-3 pl-3 pr-2.5 text-primary-text placeholder-distinct-text outline-none disabled:cursor-not-allowed"
        :placeholder="shrinkLabel ? '' : label"
        role="textbox"
        :type="type"
        :value="modelValue"
        v-bind="$attrs"
      />
      <span
        v-if="$slots.icons && iconLocation === 'right'"
        class="flex items-center gap-2 px-2.5"
      >
        <slot name="icons"></slot>
      </span>

      <!-- Using a fieldset allows the label to overlay the border. -->
      <fieldset
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 -top-[5px] bottom-0 rounded border pl-3 pr-2.5"
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
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  hasError: false,
  iconLocation: "right",
  type: "text",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
const inputRef = ref<HTMLInputElement | null>(null);
const shrinkLabel = ref<boolean>(!!props.modelValue);
let autofillSyncIntervalId: ReturnType<typeof setInterval> | undefined;

const isAutofilled = (input: HTMLInputElement): boolean => {
  try {
    return input.matches(":-webkit-autofill") || input.matches(":autofill");
  } catch {
    return false;
  }
};

const syncShrinkLabelState = () => {
  const input = inputRef.value;
  if (!input) {
    return false;
  }
  // Focus/blur/input events own label state during interaction. Guard for SSR/Vitest (no document).
  if (document && document.activeElement === input) {
    return false;
  }
  const hasAutofill = isAutofilled(input);
  shrinkLabel.value = !!input.value || hasAutofill;
  return hasAutofill;
};

const handleFocus = () => {
  shrinkLabel.value = true;
};

const handleBlur = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement | null;
  if (target && !target.value && !isAutofilled(target)) {
    shrinkLabel.value = false;
  }
};

const handleAnimationStart = (event: AnimationEvent) => {
  if (event.animationName === "onAutoFillStart") {
    shrinkLabel.value = true;
  }
};

const updateShrinkLabelState = (input: HTMLInputElement | null) => {
  if (!input) {
    return;
  }
  if (document && document.activeElement === input) {
    shrinkLabel.value = true;
    return;
  }
  shrinkLabel.value = !!input.value || isAutofilled(input);
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  emit("update:modelValue", target?.value ?? "");
};

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  updateShrinkLabelState(target);
};

const handlePointerDown = (event: PointerEvent) => {
  const target = event.target as HTMLInputElement | null;
  if (target?.disabled) {
    return;
  }
  shrinkLabel.value = true;
};

watch(
  () => props.modelValue,
  (value) => {
    const input = inputRef.value;
    if (!input) {
      shrinkLabel.value = !!value;
      return;
    }
    if (document && document.activeElement === input) {
      shrinkLabel.value = true;
      return;
    }
    shrinkLabel.value = !!value || isAutofilled(input);
  }
);

onMounted(() => {
  // Browser autofill may populate after hydration without emitting input events.
  let autofillDetected = syncShrinkLabelState();
  let checks = 0;
  autofillSyncIntervalId = setInterval(() => {
    checks += 1;
    autofillDetected = syncShrinkLabelState() || autofillDetected;
    if (checks >= 30 || autofillDetected) {
      if (autofillSyncIntervalId) {
        clearInterval(autofillSyncIntervalId);
      }
    }
  }, 100);
});

onBeforeUnmount(() => {
  if (autofillSyncIntervalId) {
    clearInterval(autofillSyncIntervalId);
  }
});
</script>

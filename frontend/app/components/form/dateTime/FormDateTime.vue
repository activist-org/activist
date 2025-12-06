<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <DatePicker
    :id="generatedId"
    v-model="date"
    :mode="mode"
    :is-dark="isDark"
    :color="colorModePreference"
    :popover="{ visibility: 'focus' }"
    class="w-full"
  >
    <template #default="{ inputValue, inputEvents }">
      <div
        class="primary-text relative inline-flex w-full flex-col space-y-2 align-top"
      >
        <label
          class="z-1 absolute transition-all duration-200 ease-out"
          :class="{
            'translate-x-4 translate-y-[-0.5rem] text-sm text-distinct-text':
              shrinkLabel || inputValue,
            'translate-y-[0.6rem] pl-[12px]':
              !shrinkLabel && !inputValue && iconLocation === 'right',
            'translate-y-[0.6rem] pl-[3.4rem]':
              !shrinkLabel && !inputValue && iconLocation === 'left',
          }"
          :for="id"
        >
          {{ label }}
        </label>

        <div
          class="border-box relative inline-flex select-none items-center overflow-hidden text-left text-distinct-text"
        >
          <!-- Left Icon Slot -->
          <span
            v-if="$slots.icons && iconLocation === 'left'"
            class="flex items-center gap-2 px-[10px]"
          >
            <slot name="icons"></slot>
          </span>

          <input
            :id="id"
            :value="inputValue"
            v-on="inputEvents"
            @focus="onFocus"
            @blur="onBlur"
            class="box-content h-5 w-full bg-transparent py-3 pl-[12px] pr-[10px] text-primary-text placeholder-distinct-text outline-none"
            :placeholder="shrinkLabel ? '' : label"
            role="textbox"
            :type="type"
            v-bind="$attrs"
          />

          <!-- Right Icon Slot (Default Calendar Icon if none provided) -->
          <Icon
            v-if="!$slots.icons && iconLocation === 'right'"
            name="material-symbols:calendar-month"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-text dark:text-cta-orange"
          />

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
              :class="{ 'max-w-[0.01px]': !shrinkLabel && !inputValue }"
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
  </DatePicker>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";

defineOptions({
  inheritAttrs: false,
});

export interface Props {
  id?: string;
  label: string;
  modelValue?: Date | null;
  hasError?: boolean;
  iconLocation?: "left" | "right";
  type?: string;
  mode?: "date" | "dateTime" | "time";
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  modelValue: null,
  hasError: false,
  iconLocation: "right",
  type: "text",
  mode: "dateTime",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: Date | null): void;
}>();

const generatedId = props.id ?? uuidv4();
const shrinkLabel = ref<boolean>(!!props.modelValue);

// Proxy for v-model to handle Date object
const date = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const onFocus = () => {
  shrinkLabel.value = true;
};

const onBlur = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement | null;
  // Only unshrink if input is empty
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

const colorMode = useColorMode();
const colorModePreference = computed(() =>
  colorMode.preference === "light" ? "light" : "dark"
);
const isDark = computed(() => colorMode.value === "dark");
</script>

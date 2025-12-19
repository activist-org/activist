<template>
  <DatePicker
    :id="generatedId"
    :model-value="modelValue"
    @update:modelValue="onUpdate"
    :mode="mode"
    :is-dark="isDark"
    :color="colorModePreference"
    :masks="masks"
    hide-time-header
    class="w-full"
    v-bind="$attrs"
  />
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
  label?: string;
  modelValue?: Date | { start: Date; end: Date } | null | undefined;
  mode?: "date" | "dateTime" | "time";
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  modelValue: null,
  mode: "dateTime",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: unknown): void;
}>();

const generatedId = props.id ?? uuidv4();

const masks = computed(() => {
  if (props.mode === 'time') return { input: 'h:mm A' };
  if (props.mode === 'dateTime') return { input: 'MM/DD/YYYY h:mm A' };
  return { input: 'MM/DD/YYYY' };
});

const onUpdate = (val: unknown) => {

  // Safety check: v-calendar sometimes emits arrays in edge cases
  if (Array.isArray(val) && props.mode === 'time') {
    emit("update:modelValue", val[0] ?? null);
    return;
  }

  emit("update:modelValue", val);
};

const colorMode = useColorMode();
const colorModePreference = computed(() =>
  colorMode.preference === "light" ? "light" : "dark"
);
const isDark = computed(() => colorMode.value === "dark");
</script>

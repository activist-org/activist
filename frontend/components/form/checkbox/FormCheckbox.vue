<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="relative flex flex-row items-center justify-start">
    <input
      :id="uuid"
      class="focus-brand peer mb-0 h-[1.375rem] w-[1.375rem] cursor-pointer appearance-none rounded-sm border border-menu-selection bg-layer-0"
      type="checkbox"
      v-bind="{ ...$attrs, onChange: updateValue }"
      :checked="modelValue"
    />
    <div
      class="pointer-events-none absolute left-[0.2rem] hidden h-[1rem] w-[1rem] rounded-sm bg-menu-selection peer-checked:block"
    ></div>
    <label
      v-if="label"
      class="ml-2 cursor-pointer select-none text-lg"
      :for="uuid"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import useFormInput from "~/composables/useFormSetup";

export interface Props {
  label?: string;
  modelValue?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  error: "",
});

const emit = defineEmits(["update:modelValue"]);
const { updateValue } = useFormInput(props, emit);
const uuid = uuidv4();
</script>

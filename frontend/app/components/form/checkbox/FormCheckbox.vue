<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="relative flex flex-row items-center justify-start">
    <input
      :id="uuid"
      v-bind="{ ...$attrs, onChange: updateValue }"
      :checked="modelValue"
      class="h-5.5 w-5.5 peer mb-0 cursor-pointer appearance-none rounded-sm border border-menu-selection bg-layer-0 focus-brand"
      type="checkbox"
    />
    <div
      class="pointer-events-none absolute left-[0.2rem] hidden h-4 w-4 rounded-sm bg-menu-selection peer-checked:block"
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
const { updateValue } = useFormSetup(props, emit);
const uuid = uuidv4();
</script>

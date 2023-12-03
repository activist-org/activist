<template>
  <div
    class="flex items-center pl-[12px] pr-[10px] py-2 h-9 space-x-2 text-left border rounded-md select-none bg-light-header dark:bg-dark-header border-light-interactive dark:border-dark-interactive text-light-special-text dark:text-dark-special-text"
  >
    <Icon class="flex-shrink-0 w-4 h-4 my-1" name="bi:search" size="1em" />
    <input
      :id="uuid"
      class="w-full h-5 bg-transparent outline-none placeholder:font-bold"
      :onInput="updateValue"
      :value="modelValue"
      :placeholder="$t(placeholder)"
      type="text"
    />
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import useFormInput from "~/composables/useFormSetup";

export interface Props {
  placeholder?: string;
  modelValue?: [string, number];
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Search",
});

const emit = defineEmits(["update:modelValue"]);
const { updateValue } = useFormInput(props, emit, true);
const uuid = uuidv4();
</script>

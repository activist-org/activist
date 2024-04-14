<template>
  <div
    class="flex h-9 select-none items-center space-x-2 rounded-md border border-light-interactive bg-light-layer-2 py-2 pl-[12px] pr-[10px] text-left text-light-distinct-text dark:border-dark-interactive dark:bg-dark-layer-2 dark:text-dark-distinct-text"
  >
    <Icon class="my-1 h-4 w-4 flex-shrink-0" name="bi:search" size="1em" />
    <input
      :id="uuid"
      class="h-5 w-full bg-transparent outline-none"
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

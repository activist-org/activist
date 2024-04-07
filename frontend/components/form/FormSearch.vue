<template>
  <div
    class="bg-light-layer-2 dark:bg-dark-layer-2 border-light-interactive dark:border-dark-interactive text-light-distinct-text dark:text-dark-distinct-text flex h-9 select-none items-center space-x-2 rounded-md border py-2 pl-[12px] pr-[10px] text-left"
  >
    <Icon class="my-1 h-4 w-4 flex-shrink-0" name="bi:search" size="1em" />
    <input
      :id="uuid"
      class="h-5 w-full bg-transparent outline-none placeholder:font-bold"
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

<template>
  <div
    class="flex items-center pl-[12px] pr-[10px] py-2 min-h-[44px] space-x-2 text-left border rounded-md select-none bg-light-header dark:bg-dark-header border-light-interactive dark:border-dark-interactive text-light-special-text dark:text-dark-special-text"
  >
    <Icon class="flex-shrink-0 w-4 h-4 my-1" name="bi:search" size="1em" />
    <input
      class="w-full h-5 bg-transparent outline-none placeholder:font-bold placeholder:text-light-special-text dark:placeholder:text-dark-special-text"
      :onInput="updateValue"
      :id="uuid"
      :value="modelValue"
      :placeholder="placeholder"
      type="search"
    />
  </div>
</template>

<script setup lang="ts">
import useFormInput from "../../composables/useFormSetup";
import useUniqueID from "../../composables/useUniqueID";

const props = defineProps({
  placeholder: {
    type: String,
    default: "Search",
  },
  modelValue: {
    type: [String, Number],
  },
});

const emit = defineEmits(["update:modelValue"]);
const { updateValue } = useFormInput(props, emit, true);

const uuid = useUniqueID().getID().toString();
</script>

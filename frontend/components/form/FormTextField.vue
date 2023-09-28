<script setup lang="ts">
import useUniqueID from "~/composables/useUniqueID";
import useFormInput from "~/composables/useFormSetup";

const props = defineProps({
  placeholder: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
  },
  inputType: {
    type: String,
    default: "text",
  },
  isIconVisible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue"]);

const { updateValue } = useFormInput(props, emit, true);

const uuid = useUniqueID().getID();
</script>

<template>
  <div
    class="flex items-center pl-[12px] pr-[10px] py-2 max-h-[40px] space-x-2 text-left border rounded select-none border-light-interactive dark:border-dark-interactive text-light-special-text dark:text-dark-special-text"
  >
    <input
      class="w-full h-5 bg-transparent outline-none placeholder:text-light-special-text dark:placeholder:text-dark-special-text"
      :onInput="updateValue"
      :id="uuid"
      :value="modelValue"
      :placeholder="placeholder"
      :type="inputType"
    />
    <span v-if="isIconVisible" @click="changeInputType">
      <Icon name="mdi:eye" size="28px" />
    </span>
  </div>
</template>

<style scoped></style>

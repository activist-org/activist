<template>
  <div
    class="flex items-center pl-[12px] pr-[10px] py-2 max-h-[40px] space-x-2 text-left border rounded select-none border-light-interactive dark:border-dark-interactive text-light-special-text dark:text-dark-special-text"
  >
    <input
      class="w-full h-5 bg-transparent outline-none placeholder:text-light-special-text dark:placeholder:text-dark-special-text"
      @input="updateValue"
      :id="uuid"
      :value="modelValue"
      :placeholder="placeholder"
      :type="refInputType"
    />
    <span
      v-for="(i, index) in icons"
      :key="index"
      class="cursor-pointer"
      @click="handleIconClick(i)"
    >
      <Icon v-if="i === 'bi:eye-fill'" :name="i" size="1.4em" />
      <Icon v-else :name="i" size="1.2em" :color="getIconColor(i)" />
    </span>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { v4 as uuidv4 } from "uuid";
import useFormInput from "../../composables/useFormSetup";

export interface Props {
  placeholder?: string;
  modelValue?: string;
  inputType?: string;
  isIconVisible?: boolean;
  icons?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  modelValue: "",
  inputType: "text",
  isIconVisible: false,
});

const emit = defineEmits(["update:modelValue"]);
const { updateValue } = useFormInput({ value: props?.modelValue }, emit, false);
const uuid = uuidv4();
const refInputType = ref(props?.inputType);
const changeInputType = () => {
  refInputType.value = refInputType.value === "password" ? "text" : "password";
};

const handleIconClick = (icon: string) => {
  if (icon === "bi:eye-fill") {
    changeInputType();
  }
};

const getIconColor = (icon: string) => {
  if (icon === "bi:check-lg") {
    return "#3BA55C";
  } else if (icon === "bi:x-lg") {
    return "#BA3D3B";
  } else {
    return "#5A5A5A";
  }
};
</script>

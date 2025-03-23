<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="flex max-h-[40px] select-none items-center space-x-2 rounded border py-2 pl-[12px] pr-[10px] text-left text-distinct-text"
    :class="{
      'border-action-red dark:border-action-red': error,
      'border-interactive': !error,
    }"
  >
    <input
      @input="updateValue"
      @blur="emit('blurred')"
      @focus="emit('focused')"
      :id="uuid"
      class="h-5 w-full bg-transparent placeholder-distinct-text outline-none"
      :class="{
        'py-3': !icons,
      }"
      :value="modelValue"
      :placeholder="placeholder"
      :type="refInputType"
    />
    <span
      v-for="(i, index) in icons"
      @click="handleIconClick(i)"
      @keypress.space="handleIconClick(i)"
      @keypress.enter="handleIconClick(i)"
      :key="index"
      role="button"
      tabindex="0"
      class="cursor-pointer"
    >
      <Icon
        v-if="i === IconMap.VISIBLE && refInputType === 'password'"
        :name="i"
        size="1.4em"
      />
      <Icon
        v-else-if="i === IconMap.VISIBLE && refInputType === 'text'"
        :name="IconMap.HIDDEN"
        size="1.4em"
      />
      <Icon v-else :name="i" size="1.2em" :color="getIconColor(i)" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";

import useFormInput from "~/composables/useFormSetup";
import { IconMap } from "~/types/icon-map";

export interface Props {
  placeholder?: string;
  modelValue?: string;
  inputType?: string;
  isIconVisible?: boolean;
  icons?: string[];
  error?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  modelValue: "",
  inputType: "text",
  isIconVisible: false,
  error: false,
});

const emit = defineEmits(["update:modelValue", "blurred", "focused"]);
const { updateValue } = useFormInput({ value: props?.modelValue }, emit, false);
const uuid = uuidv4();
const refInputType = ref<string | undefined>(props?.inputType);
const changeInputType = () => {
  refInputType.value = refInputType.value === "password" ? "text" : "password";
};

const handleIconClick = (icon: string) => {
  if (icon === IconMap.VISIBLE) {
    changeInputType();
  }
};

const getIconColor = (icon: string) => {
  if (icon === `${IconMap.CHECK}`) {
    return "#3BA55C";
  } else if (icon === `${IconMap.X_LG}`) {
    return "#BA3D3B";
  } else {
    return "#5A5A5A";
  }
};
</script>

<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormTextInput2 :hasError="hasError" :type="isPassword ? 'password' : 'text'">
    <template #icons>
      <slot name="icons"></slot>
      <button @click="changeInputType">
        <Icon
          :name="isPassword ? IconMap.VISIBLE : IconMap.HIDDEN"
          size="1.4em"
        />
      </button>
    </template>
  </FormTextInput2>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

export interface Props {
  hasError?: boolean;
}

withDefaults(defineProps<Props>(), {
  hasError: false,
});

const isPassword = ref<boolean>(true);

const changeInputType = () => {
  isPassword.value = !isPassword.value;
};
</script>

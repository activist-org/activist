<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormTextInput
    :id="id"
    :hasError="hasError"
    :type="isPassword ? 'password' : 'text'"
  >
    <template #icons>
      <slot name="icons"></slot>
      <button @click="changeInputType" :id="`${id}-show-password`">
        <Icon
          :name="isPassword ? IconMap.VISIBLE : IconMap.HIDDEN"
          size="1.4em"
        />
      </button>
    </template>
  </FormTextInput>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

export interface Props {
  id: string;
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

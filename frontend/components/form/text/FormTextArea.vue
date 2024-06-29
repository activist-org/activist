<template>
  <div
    class="flex items-center space-x-2 rounded border py-2 pl-[12px] pr-[10px] text-left text-light-distinct-text dark:text-dark-distinct-text"
    :class="{
      'border-light-action-red dark:border-dark-action-red': error,
      'border-light-interactive dark:border-dark-interactive': !error,
    }"
  >
    <textarea :id="uuid"></textarea>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";

export interface Props {
  placeholder?: string;
  error?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  error: false,
});

const uuid = uuidv4();
</script>

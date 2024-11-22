<template>
  <div
    class="flex items-center space-x-2 rounded border py-2 pl-[12px] pr-[10px] text-left text-distinct-text"
    :class="{
      'border-action-red dark:border-action-red': error,
      'border-interactive': !error,
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

withDefaults(defineProps<Props>(), {
  placeholder: "",
  error: false,
});

const uuid = uuidv4();
</script>

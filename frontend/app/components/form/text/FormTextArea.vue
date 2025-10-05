<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <textarea
    :id="id"
    :placeholder="placeholder"
    rows="5"
    class="box-content flex items-center space-x-2 rounded border bg-transparent py-2 pl-[12px] pr-[10px] text-left placeholder-primary-text outline-none"
    :class="{
      'border-action-red dark:border-action-red': hasError,
      'border-interactive': !hasError,
    }"
  />
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";

export interface Props {
  placeholder?: string;
  hasError?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  hasError: false,
});

const id = props.id ?? uuidv4();
</script>

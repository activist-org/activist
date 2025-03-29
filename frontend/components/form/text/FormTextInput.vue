<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="flex max-h-[40px] select-none items-center space-x-2 rounded border py-2 pl-[12px] pr-[10px] text-left text-distinct-text"
    :class="{
      'border-action-red dark:border-action-red': hasError,
      'border-interactive': !hasError,
    }"
  >
    <input
      :id="id"
      class="h-5 w-full bg-transparent placeholder-distinct-text outline-none"
      :class="{
        'py-3': !$slots.icons,
      }"
      type="text"
      v-bind="$attrs"
    />
    <slot name="icons"></slot>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

export interface Props {
  id: string;
  hasError?: boolean;
}

withDefaults(defineProps<Props>(), {
  hasError: false,
});
</script>

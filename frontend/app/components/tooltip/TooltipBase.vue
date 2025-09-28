<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="tooltip flex flex-col space-y-1 rounded bg-layer-1 shadow-zinc-700"
    :class="{
      'elem-shadow-sm w-max px-2 py-1': !slots.default,
      'elem-shadow-md w-min px-3 py-2': slots.default,
    }"
  >
    <h4 v-if="header">
      {{ header }}
    </h4>
    <p v-if="text" class="text-left">
      {{ text }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  header?: string | null;
  text?: string | null;
}>();

const slots = useSlots();
</script>

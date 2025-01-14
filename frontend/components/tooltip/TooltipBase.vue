<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="tooltip flex flex-col space-y-1 rounded bg-layer-1 text-primary-text shadow-zinc-700"
    :class="{
      'elem-shadow-sm w-max px-2 py-1': !slots.default,
      'elem-shadow-md w-min px-3 py-2': slots.default,
    }"
  >
    <div v-if="header" class="responsive-h5">
      {{ header }}
    </div>
    <div v-if="text" class="text-left">
      {{ text }}
    </div>
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

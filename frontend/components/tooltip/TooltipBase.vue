<template>
  <div
    class="flex flex-col rounded space-y-1 shadow-zinc-700 bg-light-layer-1 dark:bg-dark-layer-1 text-light-text dark:text-dark-text tooltip"
    :class="{
      'px-2 py-1 elem-shadow-sm w-max': !slots.default,
      'px-3 py-2 elem-shadow-md w-min': slots.default,
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

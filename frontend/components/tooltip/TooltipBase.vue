<template>
  <div
    class="bg-light-layer-1 dark:bg-dark-layer-1 text-light-text dark:text-dark-text tooltip flex flex-col space-y-1 rounded shadow-zinc-700"
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

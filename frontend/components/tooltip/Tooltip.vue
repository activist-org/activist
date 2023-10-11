<template>
  <div
    class="flex flex-col space-y-1 rounded shadow-zinc-700 bg-light-distinct dark:bg-dark-distinct text-light-text dark:text-dark-text tooltip"
    :class="{
      'px-2 py-1 shadow-sm w-max': !slots.default,
      'px-3 py-2 shadow-md w-min': slots.default,
    }"
  >
    <div class="responsive-h5" v-if="header">
      {{ header }}
    </div>
    <div class="text-left" v-if="text">
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

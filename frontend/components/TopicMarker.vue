<template>
  <div
    class="topic-marker w-fit h-7 p-2 py-1 px-3 flex justify-between items-center rounded-full border bg-light-cta-orange/40 text-light-cta-orange border-light-cta-orange dark:bg-dark-cta-orange/50 dark:border-dark-cta-orange dark:text-dark-cta-orange"
  >
    <Icon
      name="bi:globe"
      size="1em"
      class="flex-shrink-0 w-5 h-5 my-1 rounded-full"
    />
    <p class="text-2xl text-center pl-2 font-bold">{{ topic }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  topic: string;
}>();
const localePath = useLocalePath();
</script>

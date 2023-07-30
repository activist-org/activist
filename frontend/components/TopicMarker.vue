<template>
  <div
    class="flex items-center justify-between py-3 pl-2 pr-3 border rounded-full topic-marker w-fit h-7 bg-light-cta-orange/30 text-light-cta-orange border-light-cta-orange dark:bg-dark-cta-orange/40 dark:border-dark-cta-orange dark:text-dark-cta-orange hover:bg-light-cta-orange-hover/30 hover:text-light-cta-orange-hover hover:border-light-cta-orange-hover hover:dark:bg-dark-cta-orange-hover/40 hover:dark:border-dark-cta-orange-hover hover:dark:text-dark-cta-orange-hover hover:cursor-pointer active:bg-light-cta-orange/30 active:text-light-cta-orange active:border-light-cta-orange active:dark:bg-dark-cta-orange/40 active:dark:border-dark-cta-orange active:dark:text-dark-cta-orange"
  >
    <Icon
      name="bi:globe"
      size="1em"
      class="flex-shrink-0 w-5 h-5 my-1 rounded-full"
    />
    <p class="pl-2 text-base font-bold text-center select-none">{{ topic }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  topic: string;
}>();
const localePath = useLocalePath();
</script>

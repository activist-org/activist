<template>
  <div
    class="flex items-center justify-between pl-2 pr-3 border rounded-full w-max h-max bg-light-cta-orange text-light-text border-light-text dark:bg-dark-cta-orange/10 dark:border-dark-cta-orange dark:text-dark-cta-orange hover:bg-light-cta-orange-hover hover:dark:bg-dark-cta-orange/25 hover:cursor-pointer active:bg-light-cta-orange active:dark:bg-dark-cta-orange/10 shadow-sm shadow-zinc-700"
  >
    <Icon
      class="flex-shrink-0 w-5 h-5 my-1 rounded-full"
      name="bi:globe"
      size="1em"
    />
    <p class="pl-2 text-base font-bold text-center select-none">
      {{ topic }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  topic: string;
}>();
</script>

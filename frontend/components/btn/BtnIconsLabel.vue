<template>
  <div class="flex items-center justify-center">
    <Icon v-if="leftIcon" class="mr-2" :name="leftIcon" :size="iconSize" />
    <span v-if="label" class="mx-auto">{{ $t(label) }}</span>
    <div v-else class="-mx-1"></div>
    <Icon v-if="rightIcon" class="ml-2" :name="rightIcon" :size="iconSize" />
    <div
      v-if="counter"
      class="px-1 py-[0.1rem] ml-2 -m-[0.1rem] rounded-lg bg-black/20 dark:bg-dark-cta-orange/25"
    >
      {{ counter }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
  leftIcon?: string;
  rightIcon?: string;
  iconSize?: string;
  counter?: number;
}>();
</script>

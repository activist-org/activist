<template>
  <div class="h-fill flex items-center justify-center">
    <Icon
      v-if="leftIcon"
      class="mr-2"
      :class="{ 'max-md:mr-0': hideLabelOnMobile }"
      :name="leftIcon"
      :size="iconSize"
    />
    <span
      v-if="label"
      class="mx-auto"
      :class="{ 'hidden md:block': hideLabelOnMobile }"
      >{{ $t(label) }}</span
    >
    <div v-else class="-mx-1"></div>
    <Icon v-if="rightIcon" class="ml-2" :name="rightIcon" :size="iconSize" />
    <div
      v-if="counter"
      class="dark:bg-cta-orange/25 -m-[0.1rem] ml-2 rounded-lg bg-black/20 px-1 py-[0.1rem]"
    >
      {{ counter }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
  hideLabelOnMobile?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  iconSize?: string;
  counter?: number;
}>();
</script>

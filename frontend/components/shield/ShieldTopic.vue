<template>
  <div
    class="flex items-center justify-between pl-2 pr-3 border rounded-full w-max h-max hover:cursor-pointer style-cta elem-shadow-sm"
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

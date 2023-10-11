<template>
  <div
    class="max-w-full px-4 py-6 text-center border-4 cursor-pointer select-none card-style grid place-content-center rounded-2xl min-width-fit min-height-fit"
    :class="[textColor, borderColor, backgroundColor]"
  >
    <div
      class="pb-2 text-5xl sm:text-6xl md:text-5xl xl:text-6xl font-bold tracking-tighter"
    >
      {{ number }}
    </div>
    <div class="text-lg xl:text-xl font-bold">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
  number: string;
  textColor: string;
  borderColor: string;
  backgroundColor: string;
}>();
</script>

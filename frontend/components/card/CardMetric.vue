<template>
  <div
    class="max-w-full px-4 py-6 text-center border-4 cursor-pointer select-none card-style grid place-content-center rounded-2xl min-width-fit min-height-fit"
    :class="[textColor, borderColor, backgroundColor]"
  >
    <div
      class="pb-2 text-5xl font-bold tracking-tighter sm:text-6xl md:text-5xl xl:text-6xl"
    >
      {{ number }}
    </div>
    <div class="text-lg font-bold xl:text-xl">
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

<template>
  <div
    class="max-w-full px-3 py-4 text-center border-2 cursor-pointer select-none card-style grid place-content-center rounded-2xl min-width-fit min-height-fit"
    :class="[textColor, borderColor, backgroundColor]"
  >
    <div
      class="pb-1 text-3xl font-bold tracking-tighter sm:text-4xl md:text-3xl xl:text-4xl"
    >
      {{ number.toString() }}
    </div>
    <div class="text-lg font-bold xl:text-xl">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
  number: number;
  textColor: string;
  borderColor: string;
  backgroundColor: string;
}>();
</script>

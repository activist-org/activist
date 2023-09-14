<template>
  <div
    class="max-w-full px-4 py-6 text-center border-4 card-style grid place-content-center rounded-2xl min-width-fit min-height-fit max-h-40"
    :class="[textColor, borderColor, backgroundColor]"
  >
    <div class="pb-2 text-5xl font-bold tracking-tighter">
      {{ number }}
    </div>
    <div class="text-lg font-bold">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: String;
  number: String;
  textColor: String;
  borderColor: String;
  backgroundColor: String;
}>();
</script>

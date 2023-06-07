<template>
  <div
    class="card-style grid place-content-center rounded-2xl px-4 py-6 border-4 text-center min-width-fit max-w-full min-height-fit max-h-40"
    :class="[borderColor, backgroundColor, textColor]"
  >
    <div class="tracking-tighter text-5xl font-bold pb-2">
      {{ number }}
    </div>
    <div class="text-lg font-bold">{{ text }}</div>
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

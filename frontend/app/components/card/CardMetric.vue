<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="card-style min-width-fit min-height-fit grid max-w-full cursor-pointer select-none place-content-center rounded-2xl border-2 px-3 py-4 text-center"
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

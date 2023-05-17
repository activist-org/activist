<template>
  <div class="rounded-md bg-light-header w-1/4">
    <div class="px-2 py-2 sm:px-5 sm:py-5">
      <div class="flex items-center justify-start gap-1 w-full border mb-3">
        <Icon v-if="iconName" :name="iconName" />
        <h1 class="text-xl font-bold">{{ title }}</h1>
      </div>
      <p class="text-xl font-semibold pb-3">
        {{ description }}
      </p>
      <div class="w-full bg-light-section-div h-40 rounded-md">
        <img src="#" alt="" class="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  iconName?: string;
  title?: string;
  description?: string;
}>();
</script>

<style></style>

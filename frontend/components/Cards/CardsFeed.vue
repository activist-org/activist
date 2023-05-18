<template>
  <div class="rounded-md bg-light-header dark:bg-dark-header">
    <div class="responsive-px-2 responsive-py-2">
      <div class="flex items-center justify-start gap-1 w-full mb-3">
        <Icon v-if="iconName" :name="iconName" />
        <h1 class="responsive-text-1 font-bold">{{ title }}</h1>
      </div>
      <p class="responsive-text-0 font-base pb-3">
        {{ description }}
      </p>
      <div class="w-full bg-light-section-div dark:bg-dark-section-div h-40 rounded-md">
        <img :src="imgUrl" alt="" class="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  iconName?: string;
  title?: string;
  description?: string;
  imgUrl?: string;
}>();
</script>

<style></style>

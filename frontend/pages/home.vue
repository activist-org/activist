<template>
  <NuxtLayout name="sidebar">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ["user-only"],
});
</script>

<template>
  <Loading />
  <div>
    <NuxtLayout>
      <ModalCommandPalette />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk: any) => {
    return titleChunk ? `${titleChunk} • activist` : "activist";
  },
});
</script>

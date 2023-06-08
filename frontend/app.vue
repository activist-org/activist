<template>
  <body>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </body>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk: any) => {
    return titleChunk ? `${titleChunk} • activist` : "activist";
  },
});
</script>

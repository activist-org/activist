<template>
  <body class="bg-light-content-bg dark:bg-dark-content-bg">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </body>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} • activist` : "activist";
  },
});
</script>

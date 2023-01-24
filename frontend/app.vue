<template>
  <body class="bg-light-content dark:bg-dark-content">
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

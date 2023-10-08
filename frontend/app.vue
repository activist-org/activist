<template>
  <loading />
  <div>
    <nuxtlayout>
      <nuxtpage />
    </nuxtlayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk: any) => {
    return titleChunk ? `${titleChunk} • activist` : "activist";
  },
});
</script>

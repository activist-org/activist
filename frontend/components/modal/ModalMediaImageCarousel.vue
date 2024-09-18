<template>
  <ModalBase :modalName="modalName">
    <MediaImageCarousel :fullscreen="true" />
  </ModalBase>
</template>

<script setup lang="ts">
const modalName = "ModalMediaImage";
</script>

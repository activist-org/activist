<template>
  <ModalBase @closeModal="handleCloseModal" :modalName="modalName">
    <MediaImageCarousel :fullscreen="true" />
  </ModalBase>
</template>

<script setup lang="ts">
const modalName = "ModalMediaImage";

const handleCloseModal = () => {
  // Watch for closeModal emit and do cleanup when it happens.
};
</script>

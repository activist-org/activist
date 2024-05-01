<template>
  <div class="relative">
    <MediaImageCarousel :fullscreen="false" />
    <button
      @click="openModal()"
      @keydown.enter="openModal()"
      class="focus-brand absolute right-2 top-2 z-10 hidden rounded-lg border border-black/80 bg-white/80 p-1 text-black/80 dark:border-white/80 dark:bg-black/80 dark:text-white/80 md:block"
    >
      <Icon name="bi:fullscreen" size="1.5em" />
    </button>
    <ModalMediaImageCarousel
      @closeModal="handleCloseModal"
      :isOpen="modalIsOpen"
    />
  </div>
</template>

<script setup lang="ts">
const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>

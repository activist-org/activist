<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalShouldClose == false ? modalIsOpen : false"
  >
    <MediaImageCarousel :fullscreen="true" />
  </ModalBase>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
}>();

const modalIsOpen = computed(() => props.isOpen);
const modalShouldClose = ref(false);

const emit = defineEmits(["closeModal"]);
const handleCloseModal = () => {
  modalShouldClose.value = true;
  emit("closeModal");
  modalShouldClose.value = false;
};
</script>

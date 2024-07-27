<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalIsOpen"
    :imageModal="true"
    :modalName="modalName"
  >
    <img
      v-if="$colorMode.value == 'light'"
      class="w-4/5 object-contain"
      :src="imageURL + '_light.png'"
      :alt="$t(imageAltText)"
    />
    <img
      v-else-if="$colorMode.value == 'dark'"
      class="w-4/5 object-contain"
      :src="imageURL + '_dark.png'"
      :alt="$t(imageAltText)"
    />
  </ModalBase>
</template>

<script setup lang="ts">
const props = defineProps<{
  imageURL: string;
  imageAltText: string;
  isOpen: boolean;
}>();

const modals = useModals();
const modalName = "ModalImage";
let modalIsOpen = computed(() => props.isOpen);

onMounted(() => {
  modalIsOpen = computed(() => modals.modals[modalName].isOpen);
});

const handleCloseModal = () => {
  modals.closeModal(modalName);
};
</script>

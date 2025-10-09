<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :imageModal="true"
    :isOpen="modalIsOpen"
    :modalName="modalName"
  >
    <img
      v-if="$colorMode.value == 'light'"
      :alt="$t(imageAltText)"
      class="w-4/5 object-contain"
      :src="imgUrl + '_light.png'"
    />
    <img
      v-else-if="$colorMode.value == 'dark'"
      :alt="$t(imageAltText)"
      class="w-4/5 object-contain"
      :src="imgUrl + '_dark.png'"
    />
  </ModalBase>
</template>

<script setup lang="ts">
const props = defineProps<{
  imgUrl: string;
  imageAltText: string;
  isOpen: boolean;
}>();

const modals = useModals();
const modalName = "ModalImage";
let modalIsOpen = computed(() => props.isOpen);

onMounted(() => {
  modalIsOpen = computed(() => modals.modals[modalName]?.isOpen ?? false);
});

const handleCloseModal = () => {
  modals.closeModal(modalName);
};
</script>

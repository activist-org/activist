<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="relative">
    <MediaImageCarousel :fullscreen="true" :organizationId="organizationId" />
    <!-- <button
      @click="openModal()"
      @keydown.enter="openModal()"
      class="focus-brand absolute right-2 top-2 z-10 hidden rounded-lg border border-black/80 bg-white/80 p-1 text-black/80 dark:border-white/80 dark:bg-black/80 dark:text-white/80 md:block"
    >
      <Icon :name="IconMap.FULL_SCREEN" size="1.5em" />
    </button> -->
    <ModalMediaImageCarousel @closeModal="handleCloseModal" />
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const modals = useModals();
const modalName = "ModalMediaImage";

const modalIsOpen = ref(false);

const props = defineProps<{
  organizationId?: string;
}>();

function openModal() {
  modals.openModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
}

const handleCloseModal = () => {
  modals.closeModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
};
</script>

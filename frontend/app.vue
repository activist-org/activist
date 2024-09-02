<template>
  <Loading />
  <div>
    <NuxtLayout>
      <ModalCommandPalette :paletteData="commandPaletteData" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useMagicKeys, whenever } from "@vueuse/core";
import { commandPaletteData } from "~/types/command-palette";

useHead({
  titleTemplate: (titleChunk: string | undefined) => {
    return titleChunk ? `${titleChunk} • activist` : "activist";
  },
});

// Handle ctrl / meta keystrokes to open modal.
const { isMacOS } = useDevice();

const { meta_k, ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (["meta_k", "ctrl_k"].includes(e.key) && e.type === "keydown")
      e.preventDefault();
  },
});

const modals = useModals();
const modalName = "ModalCommandPalette";
const modalIsOpen = ref(false);

function openModal() {
  modals.openModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
}

whenever(meta_k, () => {
  if (isMacOS) {
    openModal();
  }
});
whenever(ctrl_k, () => {
  if (!isMacOS) {
    openModal();
  }
});
</script>

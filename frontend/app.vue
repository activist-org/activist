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

// Changed titleChunk: any to titleChunk: string | undefined, in order to get rid of eslint warnings. Was type 'any'.
useHead({
  titleTemplate: (titleChunk: string | undefined) => {
    return titleChunk ? `${titleChunk} • activist` : "activist";
  },
});

// Handle cntl / meta keystrokes to open modal.
const { isMacOS } = useDevice();

const { meta_k, ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (["meta_k", "ctrl_k"].includes(e.key) && e.type === "keydown")
      e.preventDefault();
  },
});

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

const modals = useModals();
const modalName = "ModalCommandPalette";
const modalIsOpen = ref(false);

function openModal() {
  modals.openModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
}
</script>

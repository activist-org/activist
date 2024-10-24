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

import { useModalHandlers } from "~/composables/useModalHandlers";
const { openModal: openModalCommandPalette } = useModalHandlers(
  "ModalCommandPalette"
);

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

whenever(meta_k, () => {
  if (isMacOS) {
    openModalCommandPalette();
  }
});
whenever(ctrl_k, () => {
  if (!isMacOS) {
    openModalCommandPalette();
  }
});
</script>

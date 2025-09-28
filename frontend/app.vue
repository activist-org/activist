<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <LoadingScreen />
  <div>
    <NuxtLayout>
      <Toaster :theme="isDark ? 'dark' : 'light'" :richColors="true" />
      <ModalCommandPalette :paletteData="commandPaletteData" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useMagicKeys, whenever } from "@vueuse/core";
import { Toaster } from "vue-sonner";

import { commandPaletteData } from "~/types/command-palette";

const { openModal: openModalCommandPalette } = useModalHandlers(
  "ModalCommandPalette"
);

useHead({
  titleTemplate: (titleChunk: string | undefined) => {
    return titleChunk ? `${titleChunk} • activist` : "activist";
  },
});

// Handle ctrl / meta keystrokes to open modal.
// @ts-expect-error useDevice is not available in current VueUse version
const { isMacOS } = useDevice();

const { meta_k, ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (["meta_k", "ctrl_k"].includes(e.key) && e.type === "keydown")
      e.preventDefault();
  },
});

// @ts-expect-error useColorMode is not available in current setup
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

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

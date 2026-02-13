<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <LoadingScreen />
  <NuxtLayout>
    <Toaster :richColors="true" :theme="isDark ? 'dark' : 'light'" />
    <ModalCommandPalette :paletteData="commandPaletteData" />
    <ModalCreateEvent />
    <ModalCreateOrganization />
    <ModalCreateGroup />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useMagicKeys, whenever } from "@vueuse/core";
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import "v-calendar/style.css";

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

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

whenever(meta_k ?? ref(false), () => {
  if (isMacOS) {
    openModalCommandPalette();
  }
});
whenever(ctrl_k ?? ref(false), () => {
  if (!isMacOS) {
    openModalCommandPalette();
  }
});
</script>

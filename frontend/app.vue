<template>
  <Loading />
  <div>
    <NuxtLayout>
      <!-- Dummy target to receive click event. A click event triggers ModalCommandPalette. -->
      <div
        @click="openModal()"
        @keydown.enter="openModal()"
        id="clickTarget"
        class="hidden"
        role="button"
        tabIndex="0"
      />
      <ModalCommandPalette
        @closeModal="handleCloseModal"
        :isOpen="modalIsOpen"
        :paletteData="paletteData"
        :modalName="modalName"
      />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useMagicKeys, whenever } from "@vueuse/core";
import { paletteData } from "@/components/modal/command-palette/CommandPaletteData";

useHead({
  titleTemplate: (titleChunk: any) => {
    return titleChunk ? `${titleChunk} • activist` : "activist";
  },
});
const modals = useModals();
const modalName = "generalModal";
const modalIsOpen = ref(false);

function openModal() {
  modals.openModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
}

const handleCloseModal = () => {
  modals.closeModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
};

const { isMacOS } = useDevice();

const { meta_k, ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (["meta_k", "ctrl_k"].includes(e.key) && e.type === "keydown")
      e.preventDefault();
  },
});

const doWhenever = () => {
  // Trigger ModalBase @click="openModal".
  const clickTarget = document.getElementById("clickTarget");
  if (clickTarget) {
    clickTarget.click();
  }
};

whenever(meta_k, () => {
  if (isMacOS) {
    doWhenever();
  }
});
whenever(ctrl_k, () => {
  if (!isMacOS) {
    doWhenever();
  }
});
</script>
~/components/modal/command-palette/CommandPaletteData

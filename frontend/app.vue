<template>
  <Loading />
  <div>
    <NuxtLayout :pageType="routeToPageType">
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
      />
      <NuxtPage @routeToName="updateRouteTo" />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useMagicKeys, whenever } from "@vueuse/core";

useHead({
  titleTemplate: (titleChunk: any) => {
    return titleChunk ? `${titleChunk} • activist` : "activist";
  },
});

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
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

const routeToPageType = ref("");
const updateRouteTo = (route: string) => {
  console.log(`Hey heading to: ${route}`);
  routeToPageType.value = route;
};
</script>

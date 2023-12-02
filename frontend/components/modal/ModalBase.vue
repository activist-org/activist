<template>
  <!-- Normal display on page -->
  <div @click="openModal">
    <slot name="normalDisplay"></slot>
  </div>
  <!-- Modal pop up -->
  <Dialog @close="closeModal" class="relative z-50" :open="isOpen">
    <div
      @click="closeModal"
      class="fixed inset-0 bg-light-popup dark:bg-dark-popup"
      aria-hidden="true"
    />
    <div
      :class="[
        imageModal
          ? 'fixed top-0 z-10 flex flex-col items-center w-full h-screen overflow-hidden cursor-pointer bg-light-popup dark:bg-dark-popup'
          : 'fixed inset-0 flex w-screen items-center justify-center'
        ]"
    >
      <DialogPanel
        :class="[
          imageModal
            ? 'flex flex-col items-center'
            : 'pl-6 h-full md:h-auto overflow-y-auto w-full max-w-4xl card-style text-light-text dark:text-dark-text container p-5',
        ]"
      >
        <button
          v-if="imageModal"
          @click="closeModal"
          class="absolute right-0 p-1 mt-8 mr-24 rounded-full text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text focus-brand"
          :aria-label="$t('components.modal-image.close-modal-aria-label')"
        >
          <Icon class="w-10 h-10" name="bi:x-circle-fill" />
        </button>
        <DialogTitle v-else class="font-display flex justify-between">
          <p class="text-3xl md:responsive-h2 font-bold">
            <!-- $t to go here -->
            {{ modalTitle }}
          </p>
          <button
            @click="closeModal"
            class="p-1 rounded-full text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text focus-brand"
          >
            <Icon class="w-10 h-10" name="bi:x-circle-fill" />
          </button>
        </DialogTitle>
        <button
          v-if="imageModal"
          @click="closeImgModal"
          class="flex flex-col items-center justify-center w-4/5 focus-brand"
          :aria-label="$t('components.modal-image.close-modal-aria-label')"
        >
          <slot name="modalDisplay"></slot>
        </button>
        <div v-else>
            <slot name="modalDisplay"></slot>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel } from "@headlessui/vue";
import { ref } from "vue";

const props = defineProps<{
  imageModal?: boolean;
  modalTitle?: string;
}>();

const isOpen = ref(false);

function openModal() {
  isOpen.value = true;
}

function closeModal() {
  isOpen.value = false;
}

function closeImgModal() {
  if (isOpen.value && props.imageModal) isOpen.value = false;
}
</script>

<template>
  <!-- Normal display on the page. -->
  <div @click="openModal" class="h-fit">
    <slot name="normalDisplay" />
  </div>
  <!-- Modal pop up from page element. -->
  <Dialog @close="closeModal" class="relative z-50" :open="isOpen">
    <div
      @click="closeModal"
      class="fixed inset-0 bg-light-popup dark:bg-dark-popup cursor-pointer"
      aria-hidden="true"
    />
    <div
      class="cursor-pointer"
      :class="{
        'fixed top-0 z-10 flex flex-col items-center w-full h-screen overflow-hidden':
          imageModal,
        'fixed inset-0 flex w-screen items-center justify-center': !imageModal,
      }"
    >
      <DialogPanel
        :class="{
          'flex flex-col items-center': imageModal,
          'pl-6 h-full md:h-auto overflow-y-auto w-full max-w-4xl card-style text-light-text dark:text-dark-text container p-5 cursor-default':
            !imageModal,
        }"
      >
        <button
          v-if="imageModal"
          @click="closeModal"
          class="absolute right-0 p-1 mt-8 mr-24 rounded-full text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text focus-brand"
          :aria-label="$t('components.modal-image.close-modal-aria-label')"
        >
          <Icon class="w-10 h-10" name="bi:x-circle-fill" />
        </button>
        <div v-else class="relative">
          <button
            @click="closeModal"
            class="absolute right-0 p-1 rounded-full text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text focus-brand"
          >
            <Icon class="w-10 h-10" name="bi:x-circle-fill" />
          </button>
        </div>
        <div
          v-if="imageModal"
          @click="closeModal"
          class="flex flex-col items-center justify-center focus-brand"
          :aria-label="$t('components.modal-image.close-modal-aria-label')"
        >
          <slot name="modalDisplay" />
        </div>
        <div v-else>
          <slot name="modalDisplay" />
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel } from "@headlessui/vue";

defineProps<{
  imageModal?: boolean;
}>();

const isOpen = ref(false);

function openModal() {
  isOpen.value = true;
}

function closeModal() {
  isOpen.value = false;
}
</script>

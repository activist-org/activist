<template>
  <button
    @click="openModal"
    class="hidden p-4 cursor-pointer md:block md:float-right md:w-1/3 2xl:w-full 2xl:col-span-1 h-min focus-brand"
    :aria-label="$t('components.modal-image.open-modal-aria-label')"
  >
    <img
      v-if="$colorMode.value == 'light'"
      :src="imageURL + '_light.png'"
      :alt="$t(imageAltText)"
    />
    <img
      v-else-if="$colorMode.value == 'dark'"
      :src="imageURL + '_dark.png'"
      :alt="$t(imageAltText)"
    />
  </button>
  <Dialog @close="closeModal" class="relative z-50" :open="isOpen">
    <div
      class="fixed inset-0 bg-light-popup dark:bg-dark-popup"
      aria-hidden="true"
    />
    <div
      class="fixed top-0 z-10 flex flex-col items-center w-full h-screen overflow-hidden cursor-pointer bg-light-popup dark:bg-dark-popup"
    >
      <DialogPanel class="flex flex-col items-center">
        <button
          @click="closeModal"
          class="absolute right-0 p-1 mt-8 mr-24 rounded-full text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text focus-brand"
          :aria-label="$t('components.modal-image.close-modal-aria-label')"
        >
          <Icon class="w-10 h-10" name="bi:x-circle-fill" />
        </button>
        <button
          class="flex flex-col items-center justify-center w-4/5 focus-brand"
          v-on:click="closeModal"
          :aria-label="$t('components.modal-image.close-modal-aria-label')"
        >
          <img
            v-if="$colorMode.value == 'light'"
            class="object-contain p-12"
            :src="imageURL + '_light.png'"
            :alt="$t(imageAltText)"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            class="object-contain p-12"
            :src="imageURL + '_dark.png'"
            :alt="$t(imageAltText)"
          />
        </button>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel } from "@headlessui/vue";
import { ref } from "vue";

defineProps<{
  imageURL: string;
  imageAltText: string;
}>();

const isOpen = ref(false);

function openModal() {
  isOpen.value = true;
}

function closeModal() {
  isOpen.value = false;
}
</script>

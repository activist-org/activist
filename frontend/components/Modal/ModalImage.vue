<template>
  <button @click="openModal"
    class="hidden md:block md:float-right md:w-1/3 2xl:w-full 2xl:col-span-1 h-min p-4 cursor-pointer focus-brand"
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
  <Dialog :open="isOpen" @close="closeModal" class="relative z-50">
    <div class="fixed inset-0 bg-light-popup dark:bg-dark-popup" aria-hidden="true" />
    <div class="fixed top-0 z-10 flex flex-col items-center w-full h-screen overflow-hidden cursor-pointer bg-light-popup dark:bg-dark-popup">
      <DialogPanel class="flex flex-col items-center">
        <button
          class="absolute right-0 mt-8 mr-24 text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text rounded-full p-1 focus-brand"
          aria-label="Close modal"
          @click="closeModal"
        >
          <Icon 
            name="bi:x-circle-fill" 
            class="w-10 h-10"
          />
        </button>
        <button 
          class="flex flex-col items-center justify-center w-4/5 focus-brand"
          v-on:click="closeModal"
        >
          <img
            v-if="$colorMode.value == 'light'"
            :src="imageURL + '_light.png'"
            :alt="$t(imageAltText)"
            class="object-contain p-12"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            :src="imageURL + '_dark.png'"
            :alt="$t(imageAltText)"
            class="object-contain p-12"
          />
        </button>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import {
    Dialog,
    DialogPanel,
  } from "@headlessui/vue";

  const props = defineProps({
    imageURL: String,
    imageAltText: String,
  });

  const isOpen = ref(false);

  function openModal() {
    isOpen.value = true;
  }

  function closeModal() {
    isOpen.value = false;
  }
</script>
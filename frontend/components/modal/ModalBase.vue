<template>
  <Dialog class="relative z-50" :open="modalIsOpen">
    <!-- Backdrop -->
    <DialogBackdrop
      className="fixed inset-0 bg-light-layer-0/95 dark:bg-dark-layer-0/95"
    />

    <!-- Modal Content Wrapper -->
    <div
      @click="closeModal()"
      @keydown.enter="closeModal()"
      class="cursor-pointer"
      :class="{
        'fixed top-0 z-10 flex h-screen w-full flex-col items-center overflow-hidden':
          imageModal,
        'fixed inset-0 flex w-screen items-center justify-center': !imageModal,
      }"
    >
      <!-- Dialog Panel -->
      <DialogPanel
        :class="{
          'flex flex-col items-center': imageModal,
          'card-style-base container h-full w-full max-w-4xl cursor-default overflow-y-auto bg-light-layer-0 p-5 pl-6 text-light-text dark:bg-dark-layer-0 dark:text-dark-text md:h-auto':
            !imageModal,
        }"
      >
        <!-- Close Button -->
        <button
          @click="closeModal()"
          class="focus-brand absolute right-0 rounded-full p-1 text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text hover:dark:text-dark-text"
        >
          <Icon class="h-10 w-10" :name="IconMap.CIRCLE_X_FILL" />
        </button>

        <!-- Modal Content -->
        <div v-if="imageModal" @click="closeModal()" role="button" tabindex="0">
          <slot />
        </div>
        <div v-else>
          <slot />
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { Dialog, DialogPanel } from "@headlessui/vue";
import { useRoute } from "vue-router";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  imageModal?: boolean;
  modalName: string;
}>();

const emit = defineEmits(["closeModal"]);

const route = useRoute();
const modals = useModals(); // Modal management store
const modalName = props.modalName;
const modalIsOpen = ref(false);

// Sync modal state with the modal store
onMounted(() => {
  if (modals.modals[modalName]) {
    modalIsOpen.value = modals.modals[modalName].isOpen;
  }
});

// Watch modal state changes
watch(
  () => modals.modals[modalName]?.isOpen,
  (newVal) => {
    if (newVal !== undefined) {
      modalIsOpen.value = newVal;
    }
  }
);

// Close the modal
const closeModal = () => {
  emit("closeModal");
  modals.closeModal(modalName);
};

// Close modal on route change
watch(route, () => {
  if (modals.modals[modalName]) {
    closeModal();
  }
});
</script>

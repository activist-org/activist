<template>
  <TooltipBase class="rounded-md">
    <div class="space-y-2">
      <!-- <BtnAction
        @keydown="handleTabPress(false, $event)"
        class="flex max-h-[40px] w-full"
        :cta="true"
        label="components._global.star"
        leftIcon="bi:star"
        fontSize="lg"
        :ariaLabel="$t('components._global.star')"
      /> -->
      <BtnAction
        @click="openModal()"
        @keydown.enter="openModal()"
        @keydown="handleTabPress(true, $event)"
        class="flex max-h-[40px] w-full items-center"
        :cta="true"
        label="components.btn-action.share"
        leftIcon="bi:box-arrow-up"
        fontSize="lg"
        :ariaLabel="$t('components.btn-action.share')"
      />
      <ModalSharePage
        @closeModal="handleCloseModal"
        :cta="true"
        :resource="resource"
        :isOpen="modalIsOpen"
      />
    </div>
  </TooltipBase>
</template>

<script setup lang="ts">
import type { Resource } from "~/types/resource";

defineProps<{
  resource: Resource;
}>();

const emit = defineEmits(["tab"]);
const { handleTabPress } = useTabNavigationEmit(emit);

const modals = useModals();
const modalName = "ModalSharePage";
const modalIsOpen = ref(false);

function openModal() {
  modals.openModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
}

const handleCloseModal = () => {
  modals.closeModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
};
</script>

<template>
  <TooltipBase class="rounded-md">
    <div class="space-y-2">
      <!-- <BtnAction
        @keydown="handleTabPress(false, $event)"
        class="flex max-h-[40px] w-full"
        :cta="true"
        label="components.btn-action.support"
        leftIcon="IconSupport"
        fontSize="lg"
        :ariaLabel="$t('components.btn-action.support-user-aria-label')"
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
        :ariaLabel="$t('components.btn-action.share-user-aria-label')"
      />
      <ModalSharePage
        @closeModal="handleCloseModal"
        :cta="true"
        :user="user"
        :isOpen="modalIsOpen"
      />
    </div>
  </TooltipBase>
</template>

<script setup lang="ts">
import type { User } from "~/types/user";

defineProps<{
  user: User;
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

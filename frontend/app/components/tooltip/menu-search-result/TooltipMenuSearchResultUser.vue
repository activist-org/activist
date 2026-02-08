<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase class="rounded-md" data-testid="menu-tooltip">
    <div class="space-y-2">
      <!-- <BtnAction
        @keydown="handleTabPress(false, $event)"
        class="flex max-h-10 w-full"
        :cta="true"
        label="i18n._global.support"
        leftIcon="IconSupport"
        fontSize="lg"
        ariaLabel="i18n.components.tooltip_menu_search_result_user.support_user_aria_label"
      /> -->
      <BtnAction
        @click="openModal()"
        @keydown="handleTabPress(true, $event)"
        @keydown.enter="openModal()"
        :ariaLabel="
          $t(
            'i18n.components.tooltip_menu_search_result_user.share_user_aria_label'
          )
        "
        class="flex max-h-10 w-full items-center"
        :cta="true"
        fontSize="lg"
        label="i18n._global.share"
        :rightIcon="IconMap.SHARE"
      />
      <ModalSharePage
        @closeModal="handleCloseModal"
        :cta="true"
        :isOpen="modalIsOpen"
        :user="user"
      />
    </div>
  </TooltipBase>
</template>

<script setup lang="ts">
defineProps<{
  user: UserActivist;
}>();

const emit = defineEmits(["tab"]);
const { handleTabPress } = useTabNavigationEmit(emit);

const modals = useModals();
const modalName = "ModalSharePage";
const modalIsOpen = ref(false);

function openModal() {
  modals.openModal(modalName);
  modalIsOpen.value = modals.modals[modalName]?.isOpen ?? false;
}

const handleCloseModal = () => {
  modals.closeModal(modalName);
  modalIsOpen.value = modals.modals[modalName]?.isOpen ?? false;
};
</script>

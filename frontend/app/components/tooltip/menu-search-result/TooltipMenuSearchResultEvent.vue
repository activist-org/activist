<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase class="rounded-md" data-testid="menu-tooltip">
    <div class="flex-col space-y-2">
      <!-- <BtnAction
        @keydown="handleTabPress(false, $event)"
        class="flex max-h-10 w-full"
        :cta="true"
        label="i18n._global.support"
        leftIcon="IconSupport"
        fontSize="lg"
        ariaLabel="i18n._global.support_event_aria_label"
      /> -->
      <!-- <BtnAction
        class="flex max-h-10 w-full items-center"
        :cta="true"
        label="i18n.components.tooltip_menu_search_result_event.attend"
        leftIcon="IconJoin"
        fontSize="lg"
        ariaLabel="i18n.components.tooltip_menu_search_result_event.attend_aria_label"
      /> -->
      <BtnAction
        @click="openModal()"
        @keydown="handleTabPress(true, $event)"
        @keydown.enter="openModal()"
        ariaLabel="i18n._global.share_event_aria_label"
        class="flex max-h-10 w-full items-center"
        :cta="true"
        fontSize="lg"
        label="i18n._global.share"
        :rightIcon="IconMap.SHARE"
      />
      <BtnAction
        @click="downloadCalendarEntry"
        @keydown.enter="downloadCalendarEntry"
        ariaLabel="i18n._global.subscribe_to_event_aria_label"
        class="flex max-h-10 w-full items-center"
        :cta="true"
        fontSize="lg"
        :hideLabelOnMobile="false"
        label="i18n._global.subscribe"
        :rightIcon="IconMap.DATE"
      />
      <ModalSharePage
        @closeModal="handleCloseModal"
        :cta="true"
        :event="event"
        :isOpen="modalIsOpen"
      />
    </div>
  </TooltipBase>
</template>

<script setup lang="ts">
defineProps<{
  event: CommunityEvent;
}>();

const emit = defineEmits(["tab"]);
const { handleTabPress } = useTabNavigationEmit(emit);

const downloadCalendarEntry = () => {};

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

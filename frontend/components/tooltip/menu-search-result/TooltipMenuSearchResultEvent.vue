<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase class="rounded-md">
    <div class="flex-col space-y-2">
      <!-- <BtnAction
        @keydown="handleTabPress(false, $event)"
        class="flex max-h-[40px] w-full"
        :cta="true"
        label="i18n._global.support"
        leftIcon="IconSupport"
        fontSize="lg"
        :ariaLabel="$t('i18n._global.support_event_aria_label')"
      /> -->
      <!-- <BtnAction
        class="flex max-h-[40px] w-full items-center"
        :cta="true"
        label="i18n.components.tooltip_menu_search_result_event.attend"
        leftIcon="IconJoin"
        fontSize="lg"
        :ariaLabel="$t('i18n.components.tooltip_menu_search_result_event.attend_aria_label')"
      /> -->
      <BtnAction
        @click="openModal()"
        @keydown.enter="openModal()"
        @keydown="handleTabPress(true, $event)"
        class="flex max-h-[40px] w-full items-center"
        :cta="true"
        label="i18n._global.share"
        :rightIcon="IconMap.SHARE"
        fontSize="lg"
        :ariaLabel="$t('i18n._global.share_event_aria_label')"
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
import type { Event } from "~/types/events/event";

import { IconMap } from "~/types/icon-map";

defineProps<{
  event: Event;
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

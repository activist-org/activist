<template>
  <TooltipBase class="rounded-md">
    <div class="flex-col space-y-2">
      <!-- <BtnAction
        @keydown="handleTabPress(false, $event)"
        class="flex max-h-[40px] w-full"
        :cta="true"
        label="components.btn-action.support"
        leftIcon="IconSupport"
        fontSize="lg"
        :ariaLabel="$t('components.btn-action.support-event-aria-label')"
      /> -->
      <!-- <BtnAction
        class="flex max-h-[40px] w-full items-center"
        :cta="true"
        label="components.btn-action.attend"
        leftIcon="IconJoin"
        fontSize="lg"
        :ariaLabel="$t('components.btn-action.attend-aria-label')"
      /> -->
      <BtnAction
        @click="openModal()"
        @keydown.enter="openModal()"
        @keydown="handleTabPress(true, $event)"
        class="flex max-h-[40px] w-full items-center"
        :cta="true"
        label="components.btn-action.share"
        :leftIcon="IconMap.SHARE"
        fontSize="lg"
        :ariaLabel="$t('components._global.share-event-aria-label')"
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

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>

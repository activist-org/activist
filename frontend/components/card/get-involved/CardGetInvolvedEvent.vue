<template>
  <CardGetInvolved>
    <div class="flex items-center gap-5">
      <h3 class="responsive-h3 text-left font-display">
        {{ $t("components._global.participate") }}
      </h3>
      <IconEdit @click="openModal()" @keydown.enter="openModal()" />
      <ModalEditAboutEvent
        v-if="event"
        @closeModal="handleCloseModal"
        :event="event"
        :sectionsToEdit="[
          $t('_global.about'),
          $t('components._global.participate'),
          $t('components._global.offer-to-help-link'),
        ]"
        :isOpen="modalIsOpen"
      />
    </div>
    <div class="space-y-3 pt-3">
      <p v-if="event.getInvolved">
        {{ event.getInvolved }}
      </p>
      <p v-else>{{ $t("components.card-get-involved.participate-subtext") }}</p>
      <!-- <p>
        {{ $t("components.card-get-involved.legal-disclaimer-subtext") }}
      </p>
      <CardLegalDisclaimer v-if="disclaimer" :disclaimer="disclaimer" /> -->
      <div class="flex w-max pt-2">
        <BtnRouteInternal
          class="w-full"
          :cta="true"
          linkTo="/"
          label="components.btn-route-internal.offer-to-help"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="components.btn-route-internal.offer-to-help-aria-label"
        />
      </div>
    </div>
  </CardGetInvolved>
</template>

<script setup lang="ts">
import type { Event } from "~/types/events/event";
import { IconMap } from "~/types/icon-map";
import CardGetInvolved from "./CardGetInvolved.vue";

defineProps<{
  event: Event;
  disclaimer?: string;
}>();

const modals = useModals();
const modalName = "ModalEditAboutEvent";
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

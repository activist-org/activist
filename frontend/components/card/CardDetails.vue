<template>
  <div class="card-style px-5 py-5">
    <div class="relative w-full flex-col">
      <ModalQRCodeBtn v-if="event" :event="event" type="icon" />
      <div class="flex-col space-y-3">
        <div class="flex items-center gap-5">
          <h3 class="responsive-h3 text-left font-display">
            {{ $t("components.card-details.header") }}
          </h3>
          <IconEdit @click="openModal()" @keydown.enter="openModal()" />
          <ModalEditPageText
            v-if="event"
            @closeModal="handleCloseModal"
            :sectionsToEdit="[
              $t('_global.about'),
              $t('components._global.participate'),
              $t('components._global.offer-to-help-link'),
            ]"
            :textsToEdit="[descriptionText, getInvolvedText, getInvolvedURL]"
            :isOpen="modalIsOpen"
          />
        </div>
        <div v-if="event" class="flex-col space-y-6 py-2">
          <div class="flex items-center gap-3">
            <MetaTagOrganization
              v-for="(o, i) in event.organizations"
              :key="i"
              :organization="o"
            />
          </div>
          <!-- <MetaTagAttendance
            :numAttending="event.attendees ? event.attendees.length : 0"
            :label="$t('components.card-details.attending')"
          /> -->
          <MetaTagLocation
            v-if="event.offlineLocation"
            :location="event.offlineLocation"
          />
          <MetaTagDate :date="event.startTime" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useDescriptionText,
  useGetInvolvedText,
  useGetInvolvedURL,
} from "~/composables/useAppPageTexts";
import type { Event } from "~/types/event";

const props = defineProps<{
  event?: Event;
}>();

const { descriptionText } = useDescriptionText(props);
const { getInvolvedText } = useGetInvolvedText(props);
const { getInvolvedURL } = useGetInvolvedURL(props);

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>

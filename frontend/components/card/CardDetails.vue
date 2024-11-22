<template>
  <div class="card-style px-5 py-5">
    <div class="relative w-full flex-col">
      <ModalQRCodeBtn v-if="event" :event="event" type="icon" />
      <div class="flex-col space-y-3">
        <div class="flex items-center gap-5">
          <h3 class="responsive-h3 text-left font-display">
            {{ $t("components.card_details.header") }}
          </h3>
          <IconEdit
            @click="openModalEditAboutEvent"
            @keydown.enter="openModalEditAboutEvent"
          />
          <!-- <ModalEditAboutEvent
            v-if="event"
            :event="event"
            :sectionsToEdit="[
              $t('_global.about'),
              $t('components._global.participate'),
              $t('components._global.offer_to_help_link'),
            ]"
            :isOpen="modalIsOpen"
          /> -->
        </div>
        <div v-if="event" class="flex-col space-y-6 py-2">
          <div class="flex items-center gap-3">
            <MetaTagOrganization
              v-for="(o, i) in event.organizations.slice(0, 1)"
              :key="i"
              :organization="o"
            />
            <button
              v-if="event.organizations.length > 1"
              @click="openModalOrganizationOverview"
              @keydown.enter="openModalOrganizationOverview"
              class="text-sm font-semibold text-black"
            >
              (+{{ event.organizations.length - 1 }} more)
            </button>
            <ModalOrganizationOverview
              @closeModal="openModalOrganizationOverview"
              :cta="true"
              :event="event"
            />
          </div>
          <!-- <MetaTagAttendance
            :numAttending="event.attendees ? event.attendees.length : 0"
            :label="$t('components.card_details.attending')"
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
import { useModalHandlers } from "~/composables/useModalHandlers";
import type { Event } from "~/types/events/event";

defineProps<{
  event?: Event;
}>();

const { openModal: openModalEditAboutEvent } = useModalHandlers(
  "ModalEditAboutEvent"
);
const { openModal: openModalOrganizationOverview } = useModalHandlers(
  "ModalCommandPalette"
);
</script>

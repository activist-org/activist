<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
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
            @click="openModalEditTextEvent()"
            @keydown.enter="openModalEditTextEvent()"
          />
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
              @click="openModalOrganizationOverview()"
              @keydown.enter="openModalOrganizationOverview()"
              class="text-sm font-semibold text-black"
            >
              (+{{ event.organizations.length - 1 }} more)
            </button>
            <ModalOrganizationOverview
              @closeModal="openModalOrganizationOverview()"
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
            :location="event.offlineLocation.displayName.split(',')[0]"
          />
          <MetaTagDate :date="event.startTime.split('T')[0]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModalHandlers } from "~/composables/useModalHandlers";

const { openModal: openModalEditTextEvent } =
  useModalHandlers("ModalEditTextEvent");
const { openModal: openModalOrganizationOverview } = useModalHandlers(
  "ModalOrganizationOverview"
);

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(id);

const { event } = eventStore;
</script>

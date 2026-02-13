<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="card-style px-5 py-5">
    <div class="relative w-full flex-col">
      <ModalQRCodeBtn
        v-if="event"
        :event="event"
        reason-for-suggesting=""
        type="icon"
      />
      <div class="flex-col space-y-3">
        <div class="flex items-center gap-5">
          <h3 class="text-left font-display">
            {{ $t("i18n.components.card_details.header") }}
          </h3>
          <IconEdit
            @click="openModalTextEvent()"
            @keydown.enter="openModalTextEvent()"
          />
        </div>
        <div v-if="event" class="flex-col space-y-6 py-2">
          <div class="flex items-center gap-3">
            <MetaTagOrganization :organization="event.orgs" />
            <!-- TODO: Once we have more than one organization. -->
            <!-- <MetaTagOrganization
              v-for="(o, i) in event.orgs.slice(0, 1)"
              :key="i"
              :organization="o"
            />
            <button
              v-if="event.orgs.length > 1"
              @click="openModalOrganizationOverview()"
              @keydown.enter="openModalOrganizationOverview()"
              class="text-sm font-semibold text-black"
            >
              (+{{ event.orgs.length - 1 }} more)
            </button> -->
            <ModalOrganizationOverview
              @closeModal="openModalOrganizationOverview()"
              :cta="true"
              :event="event"
            />
          </div>
          <!-- <MetaTagAttendance
            :numAttending="event.attendees ? event.attendees.length : 0"
            :label="$t('i18n.components.card_details.attending')"
          /> -->
          <a
            v-if="event.onlineLocationLink"
            class="link-text ml-2 flex items-center gap-2 font-extrabold"
            :href="event.onlineLocationLink"
            target="_blank"
          >
            <Icon :name="IconMap.EXTERNAL_LINK" />
            <p class="link-text inline-link-underline ml-2 font-extrabold">
              {{ event.onlineLocationLink }}
            </p>
          </a>
          <MetaTagLocation
            v-if="event.physicalLocation"
            :location="event.physicalLocation.addressOrName.split(',')[0] ?? ''"
          />
          <MetaTagDates v-if="event.times" :dates="event.times" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { openModal: openModalTextEvent } = useModalHandlers("ModalTextEvent");
const { openModal: openModalOrganizationOverview } = useModalHandlers(
  "ModalOrganizationOverview"
);
const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : "";

const { data: event } = useGetEvent(eventId);
</script>

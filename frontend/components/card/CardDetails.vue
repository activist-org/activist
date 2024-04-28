<template>
  <div class="card-style px-5 py-5">
    <div class="relative w-full flex-col">
      <ModalQRCodeBtn v-if="event" :event="event" type="icon" />
      <div class="flex-col space-y-3">
        <div class="flex items-center gap-5">
          <h3 class="responsive-h3 text-left font-display">
            {{ $t("components.card-details.header") }}
          </h3>
          <IconEdit />
        </div>
        <div v-if="event" class="flex-col space-y-6 py-2">
          <div class="flex items-center gap-3">
            <MetaTagOrganization
              :organizations="event.organizations"
            ></MetaTagOrganization>
          </div>
          <MetaTagAttendance
            :numAttending="event.attending ? event.attending : 0"
            label="attending"
          />
          <MetaTagLocation
            v-if="event.inPersonLocation"
            :location="event.inPersonLocation"
          />
          <MetaTagDate :date="event.date" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/event";
import MetaTagAttendance from "../meta-tag/MetaTagAttendance.vue";

defineProps<{
  event?: Event;
}>();
</script>

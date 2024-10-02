<template>
  <ModalBase :modalName="modalName">
    <div class="px-2 pb-2 pt-1 lg:px-4 lg:pb-4 lg:pt-2">
      <DialogTitle class="font-display">
        <p class="responsive-h2 font-bold">
          {{ $t("components.modal_organization_overview.header") }}
        </p>
      </DialogTitle>
      <div class="mt-6 py-2 pr-1 md:max-h-[50vh] md:overflow-y-auto">
        <div v-if="event" class="space-y-3">
          <div
            v-for="(o, i) in event.organizations"
            :key="i"
            class="card-style m-1 p-2"
          >
            <MetaTagOrganization :organization="o" />
          </div>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import ModalBase from "~/components/modal/ModalBase.vue";
import { DialogTitle } from "@headlessui/vue";
import type { Event } from "~/types/events/event";

const props = defineProps<{
  event?: Event;
}>();
const modalName = "ModalOrganizationOverview";
</script>

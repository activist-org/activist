<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <div class="px-2 pb-2 pt-1 lg:px-4 lg:pb-4 lg:pt-2">
      <DialogTitle class="font-display">
        <p class="responsive-h2 font-bold">
          {{ $t(i18nMap._global.organizations) }}
        </p>
      </DialogTitle>
      <div class="mt-6 py-2 pr-1 md:max-h-[50vh] md:overflow-y-auto">
        <div v-if="event" class="space-y-3">
          <div class="card-style m-1 p-2">
            <MetaTagOrganization :organization="event.orgs" />
          </div>
          <!-- TODO: Once we have more than one organization. -->
          <!-- <div v-for="(o, i) in event.orgs" :key="i" class="card-style m-1 p-2">
            <MetaTagOrganization :organization="o" />
          </div> -->
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { DialogTitle } from "@headlessui/vue";
import type { Event } from "~/types/events/event";
import { i18nMap } from "~/types/i18n-map";

defineProps<{
  event?: Event;
}>();
const modalName = "ModalOrganizationOverview";
</script>

<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title
        >{{ event.name }}&nbsp;{{
          $t(i18nMap.pages._global.settings.settings_lower)
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :event="event"
      :header="
        event.name + ' ' + $t(i18nMap.pages._global.settings.settings_lower)
      "
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          class="w-max"
          :cta="true"
          label="i18nMap.pages._global.settings.save_settings"
          fontSize="sm"
          ariaLabel="i18nMap.pages._global.settings.save_settings_aria_label"
        />
      </div>
    </HeaderAppPage>
    <!-- <div class="space-y-6 pb-6">
      <CardDangerZone
        :description="$t(i18nMap.pages.events.settings.danger_zone_event_description)"
        :ctaBtnText="$t(i18nMap.pages.events.settings.danger_zone_event_cta_btn_text)"
        :ctaBtnAriaLabel="
          $t(i18nMap.pages.events.settings.danger_zone_event_cta_btn_aria_label)
        "
      />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { i18nMap } from "~/types/i18n-map";

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(id);

const { event } = eventStore;
</script>

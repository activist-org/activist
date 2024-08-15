<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ event.name }}&nbsp;{{ $t("_global.settings_lower") }}</Title>
    </Head>
    <HeaderAppPage
      :event="event"
      :header="event.name + ' ' + $t('_global.settings_lower')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          class="w-max"
          :cta="true"
          label="components.btn_action.save_settings"
          fontSize="sm"
          ariaLabel="components.btn_action.save_settings_aria_label"
        />
      </div>
    </HeaderAppPage>
    <PagePreviewSettings />
    <!-- <div class="space-y-6 pb-6">
      <CardDangerZone
        :description="$t('components.card_danger_zone.event_description')"
        :ctaBtnText="$t('components.card_danger_zone.event_cta_btn_text')"
        :ctaBtnAriaLabel="
          $t('components.card_danger_zone.event_cta_btn_aria_label')
        "
      />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { testClimateEvent } from "~/utils/testEntities";

const event = testClimateEvent;
</script>

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
          label="components.btn-action.save-settings"
          fontSize="sm"
          ariaLabel="components.btn-action.save-settings-aria-label"
        />
      </div>
    </HeaderAppPage>
    <CardDangerZone
      :description="$t('components.card-danger-zone.event-description')"
      :ctaBtnText="$t('components.card-danger-zone.event-cta-btn-text')"
      :ctaBtnAriaLabel="
        $t('components.card-danger-zone.event-cta-btn-aria-label')
      "
    />
  </div>
</template>

<script setup lang="ts">
import { testClimateEvent } from "~/utils/testEntities";

definePageMeta({
  layout: "sidebar",
});

const event = testClimateEvent;
</script>

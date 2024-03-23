<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0 flex flex-col px-4 xl:px-8"
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
import type { Event } from "~/types/event";

definePageMeta({
  layout: "sidebar",
});

const event: Event = {
  name: "Brandenburg Gate Climate Demo",
  tagline: "There is no Planet B",
  organizations: ["Berlin Climate Org"],
  type: "action",
  topic: "Environment",
  description:
    "Aute aliqua reprehenderit ex ut commodo nostrud et excepteur. Sunt amet velit sunt fugiat et excepteur dolore pariatur nisi non. Exercitation aute aute culpa commodo commodo ea Lorem aliquip id duis. Laboris nostrud ullamco ea voluptate et anim id adipisicing sint reprehenderit incididunt elit. Est fugiat pariatur elit culpa in incididunt eu esse cupidatat minim. Deserunt duis culpa minim Lorem consectetur quis fugiat ipsum nostrud voluptate veniam do. Reprehenderit duis officia in enim anim elit.",
  getInvolvedDescription:
    "Sint cillum excepteur sint cupidatat do consectetur excepteur nisi veniam. Sint id in sit eiusmod Lorem commodo minim culpa id cupidatat consectetur. Labore nisi est officia sunt occaecat.",
  inPersonLocation: "Brandenburg Gate, Berlin",
  date: new Date().toISOString().slice(0, 10),
  supporters: 30,
  imageURL: "/images/tech-from-below.svg",
  socialLinks: ["climate_org@mastodon", "climate_org@email.com"],
};
</script>

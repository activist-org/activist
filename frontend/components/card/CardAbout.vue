<template>
  <div class="px-5 py-5 card-style">
    <div class="relative flex-col w-full gap-5">
      <ModalQRCode v-if="organization" :entityName="organization.name" />
      <ModalQRCode v-if="event" :entityName="event.name" />
      <div class="flex-col space-y-3">
        <div class="flex items-center gap-5">
          <h3 class="text-left responsive-h3 font-display">
            {{ $t("_global.about") }}
          </h3>
          <Icon name="bi:pencil-square" size="1.2em" />
        </div>
        <div v-if="event" class="flex-col space-y-3">
          <MarkerTopic :topic="event.topic" />
          <div class="flex items-center gap-3">
            <MetaTagOrganization
              :organizations="event.organizations"
            ></MetaTagOrganization>
          </div>
          <div class="flex flex-col gap-3 md:gap-8 sm:flex-row sm:items-center">
            <div class="flex items-center gap-2">
              <Icon name="bx:bxs-map" size="1.2em" />
              <p>{{ event.inPersonLocation }}</p>
            </div>
            <div class="flex items-center gap-3">
              <Icon name="bi:calendar-plus" size="1.2em" />
              <p>{{ event.date }}</p>
            </div>
          </div>
          <div>
            <p class="line-clamp-2">{{ event.description }}</p>
            <button
              class="mt-2 font-semibold text-light-link-text dark:text-dark-link-text"
              :aria-label="$t('components.card-about.full-text-aria-label')"
            >
              {{ $t("components.card-about.full-text") }}
            </button>
          </div>
        </div>
        <div v-if="organization" class="flex-col space-y-3">
          <MarkerTopic :topic="organization.topic" />
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <Icon name="bx:bxs-map" size="1.2em" />
              <p>{{ organization.location }}</p>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="bi:people" size="1.2em" />
              <p>{{ organization.members }}</p>
            </div>
          </div>
          <div>
            <p class="line-clamp-3">{{ organization.description }}</p>
            <button
              class="mt-2 font-semibold text-light-link-text dark:text-dark-link-text"
              :aria-label="$t('components.card-about.full-text-aria-label')"
            >
              {{ $t("components.card-about.full-text") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/event";
import type { Organization } from "~/types/organization";

defineProps<{
  organization?: Organization;
  event?: Event;
}>();
</script>

<template>
  <div class="px-6 py-5 card-style">
    <div class="relative flex items-center gap-5">
      <h3 class="text-left responsive-h3 font-display">Get involved</h3>
      <Icon name="bi:pencil-square" size="1.2em" />
      <div class="absolute right-0 flex space-x-2">
        <BtnLabeled v-if="organization && organization.workingGroups" :cta="true" label="View all groups" linkTo="/"
          fontSize="base" />
        <BtnLabeled v-if="organization" :cta="true" label="Join organization" linkTo="/" fontSize="base"
          rightIcon="bi:arrow-right" iconSize="1.25em" />
      </div>
    </div>
    <div v-if="organization" class="mt-4">
      <div v-if="organization.workingGroups">
        <p>
          The following are working groups within
          {{ organization.name }}:
        </p>
        <CardFeed :feedItemURLs="organization.workingGroups" />
      </div>
      <div v-else>
        <p>
          Click "Join organization" above to get involved in
          {{ organization.name }}.
        </p>
      </div>
    </div>
    <div v-else-if="event" class="pt-3 space-y-3">
      <p>
        {{ event.getInvolvedDescription }}
      </p>
      <p>
        Please read the legal disclaimer below for more information on your
        rights during this event.
      </p>
      <CardLegalDisclaimer :disclaimer="disclaimer" />
      <div class="pt-2">
        <BtnLabeled :cta="true" label="Offer to help" linkTo="/" fontSize="base" rightIcon="bi:arrow-right"
          iconSize="1.25em" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~~/types/event";
import type { Organization } from "~~/types/organization";

const props = defineProps<{
  organization?: Organization;
  event?: Event;
  disclaimer: string;
}>();
</script>

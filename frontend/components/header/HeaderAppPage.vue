<template>
  <PageBreadcrumbs class="mt-4" :organization="organization" :event="event" />
  <div class="flex items-baseline gap-4">
    <h1
      class="pt-6 font-bold transition-all duration-500 responsive-h1 text-light-text dark:text-dark-text"
    >
      {{ header }}
    </h1>
    <IconOrganizationStatus v-if="status" :status="status" />
  </div>
  <div class="relative flex items-center w-full py-6">
    <h2
      :v-if="tagline"
      class="transition-all duration-500 responsive-h4 text-light-special-text dark:text-dark-special-text"
    >
      {{ tagline }}
    </h2>
    <!-- Slot is for BtnLabeled and Dropdown components at the top of the page. -->
    <div class="absolute right-0 flex items-center space-x-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~~/types/event";
import type { Organization } from "~~/types/organization";

const props = defineProps<{
  header: string;
  tagline: string;
  organization?: Organization;
  event?: Event;
}>();

let header: string;
let tagline: string;
let status: string;

if (props.organization) {
  header = props.organization.name;
  tagline = props.organization.tagline;
  status = props.organization.status;
} else if (props.event) {
  header = props.event.name;
  tagline = props.event.tagline;
} else {
  header = props.header;
  tagline = props.tagline;
}
</script>

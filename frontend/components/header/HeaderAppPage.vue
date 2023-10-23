<template>
  <PageBreadcrumbs class="mt-4" :organization="organization" :event="event" />
  <div class="flex items-baseline gap-2 md:gap-4">
    <h1
      class="pt-4 font-bold transition-all duration-500 responsive-h1 text-light-text dark:text-dark-text"
    >
      {{ headerName }}
    </h1>
    <IconOrganizationStatus v-if="headerStatus" :status="headerStatus" />
  </div>
  <div
    class="flex flex-col items-start justify-between w-full pt-2 space-y-4 lg:space-y-0 xl:pt-4 lg:flex-row grow align-center"
  >
    <h2
      v-if="headerTagline"
      class="transition-all duration-500 responsive-h4 text-light-special-text dark:text-dark-special-text"
    >
      {{ headerTagline }}
    </h2>
    <!-- Slot is for BtnLabeled and Dropdown components at the top of the page. -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Event } from "../../types/event";
import type { Organization } from "../../types/organization";

const props = defineProps<{
  header?: string;
  tagline?: string;
  organization?: Organization;
  event?: Event;
}>();

let headerName: string;
let headerTagline: string;
let headerStatus: string;

if (props.organization) {
  headerName = props.organization.name;
  headerTagline = props.organization.tagline;
  headerStatus = props.organization.status;
} else if (props.event) {
  headerName = props.event.name;
  headerTagline = props.event.tagline;
} else {
  headerName = props.header || "Default Demo Header";
  headerTagline = props.tagline || "Default Demo Tagline";
}
</script>

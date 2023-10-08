<template>
  <pagebreadcrumbs class="mt-4" :organization="organization" :event="event" />
  <div class="flex items-baseline gap-2 md:gap-4">
    <h1
      class="pt-4 font-bold transition-all duration-500 responsive-h1 text-light-text dark:text-dark-text"
    >
      {{ header }}
    </h1>
    <iconorganizationstatus v-if="status" :status="status" />
  </div>
  <div
    class="flex flex-col items-start justify-between w-full pt-2 space-y-4 lg:space-y-0 xl:pt-4 lg:flex-row grow align-center"
  >
    <h2
      v-if="tagline"
      class="transition-all duration-500 responsive-h4 text-light-special-text dark:text-dark-special-text"
    >
      {{ tagline }}
    </h2>
    <!-- slot is for btnlabeled and dropdown components at the top of the page. -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { event } from "../../types/event";
import type { organization } from "../../types/organization";

const props = defineProps<{
  header?: string;
  tagline?: string;
  organization?: organization;
  event?: event;
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
  header = props.header || "default demo header";
  tagline = props.tagline || "default demo tagline";
}
</script>

<template>
  <PageBreadcrumbs class="mt-4" :organization="organization" :event="event" />
  <div
    v-if="underDevelopment"
    class="mt-3 flex w-full bg-light-pending-yellow/40 border border-light-text rounded-md py-1 pl-4 text-light-text dark:bg-dark-pending-yellow/30 dark:text-dark-pending-yellow dark:border-dark-pending-yellow"
  >
    <p>
      🚧&nbsp;&nbsp;{{
        $t("components.header-app-page.under-development-1")
      }}&nbsp;
    </p>
    <a
      class="flex space-x-1 items-center focus-brand link-text"
      href="https://github.com/activist-org/activist"
      target="_blank"
    >
      <p>github.com/activist-org/activist</p>
      <Icon
        class="mb-1"
        name="bi:box-arrow-up-right"
        size="1em"
        style="vertical-align: baseline"
      />
    </a>
    <p></p>
    <p>&nbsp;{{ $t("components.header-app-page.under-development-2") }}</p>
  </div>
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
import type { Event } from "~/types/event";
import type { Organization } from "~/types/organization";

const props = defineProps<{
  header?: string;
  tagline?: string;
  organization?: Organization;
  event?: Event;
  underDevelopment?: boolean;
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
}

if (props.header) {
  headerName = props.header || "Default header";
}

if (props.tagline) {
  headerTagline = props.tagline || "Default tagline";
}
</script>

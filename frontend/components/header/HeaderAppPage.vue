<template>
  <PageBreadcrumbs class="mt-4" :organization="organization" :event="event" />
  <div
    v-if="underDevelopment"
    class="flex w-full py-1 pl-4 mt-3 border bg-light-warn-yellow/40 border-light-text rounded-md text-light-text dark:bg-dark-warn-yellow/30 dark:text-dark-warn-yellow dark:border-dark-warn-yellow"
  >
    <p>
      🚧&nbsp;&nbsp;{{
        $t("components.header-app-page.under-development-1")
      }}&nbsp;
    </p>
    <a
      class="flex items-center space-x-1 focus-brand link-text"
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
      class="pt-4 font-bold transition-all motion-reduce:transition-none duration-500 responsive-h1 text-light-text dark:text-dark-text"
    >
      {{ headerName }}
    </h1>
    <IconOrganizationStatus v-if="headerStatus" :status="headerStatus" />
  </div>
  <div
    class="flex flex-col items-start justify-between w-full pt-2 space-y-4 lg:space-y-0 xl:pt-4 lg:flex-row grow lg:items-center"
  >
    <h2
      v-if="headerTagline"
      class="transition-all motion-reduce:transition-none duration-500 responsive-h4 text-light-distinct-text dark:text-dark-distinct-text"
    >
      {{ headerTagline }}
    </h2>
    <!-- Slot is for Btn and Dropdown components at the top of the page. -->
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

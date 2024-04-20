<template>
  <PageBreadcrumbs
    class="mt-4 hidden md:block"
    :organization="organization"
    :event="event"
  />
  <div
    v-if="underDevelopment"
    class="mt-3 w-full rounded-md border border-light-text bg-light-warn-yellow/40 px-3 py-1 text-light-text dark:border-dark-warn-yellow dark:bg-dark-warn-yellow/30 dark:text-dark-warn-yellow"
  >
    <p class="flex flex-wrap">
      🚧&nbsp;&nbsp;{{
        $t("components.header-app-page.under-development-1")
      }}&nbsp;<a
        class="focus-brand link-text flex items-center space-x-1"
        href="https://github.com/activist-org/activist"
        target="_blank"
        ><p>{{ $t("components._global.github") }}</p>
        <Icon
          class="mb-1"
          name="bi:box-arrow-up-right"
          size="1em"
          style="vertical-align: baseline" /></a
      >&nbsp;{{ $t("components.header-app-page.under-development-2") }}&nbsp;<a
        class="focus-brand link-text flex items-center space-x-1"
        href="https://matrix.to/#/#activist_community:matrix.org"
        target="_blank"
        ><p>{{ $t("components._global.matrix") }}</p>
        <Icon
          class="mb-1"
          name="bi:box-arrow-up-right"
          size="1em"
          style="vertical-align: baseline" /></a
      >&nbsp;{{ $t("components.header-app-page.under-development-3") }}
    </p>
  </div>
  <div class="flex items-baseline gap-2 md:gap-4">
    <h1
      class="responsive-h1 pt-4 font-bold text-light-text transition-all duration-500 dark:text-dark-text"
    >
      {{ headerName }}
    </h1>
    <IconOrganizationStatus
      v-if="headerStatus && organization"
      :status="headerStatus"
      :organization="organization"
    />
  </div>
  <div
    class="flex w-full grow flex-col items-start justify-between space-y-4 pt-2 lg:flex-row lg:items-center lg:space-y-0 xl:pt-4"
  >
    <h2
      v-if="organization && organization.status === 'pending'"
      class="responsive-h4 text-light-warn-yellow transition-all duration-500 dark:text-dark-warn-yellow"
    >
      {{ $t("components.header-app-page.status-pending") }}
    </h2>
    <h2
      v-else-if="headerTagline"
      class="responsive-h4 text-light-distinct-text transition-all duration-500 dark:text-dark-distinct-text"
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

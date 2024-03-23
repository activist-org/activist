<template>
  <PageBreadcrumbs class="mt-4" :organization="organization" :event="event" />
  <div
    v-if="underDevelopment"
    class="bg-light-warn-yellow/40 border-light-text text-light-text dark:bg-dark-warn-yellow/30 dark:text-dark-warn-yellow dark:border-dark-warn-yellow mt-3 flex w-full flex-col rounded-md border py-1 pl-4 lg:flex-row"
  >
    <p>
      🚧&nbsp;&nbsp;{{
        $t("components.header-app-page.under-development-1")
      }}&nbsp;
    </p>
    <a
      class="focus-brand link-text flex items-center space-x-1"
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
      class="responsive-h1 text-light-text dark:text-dark-text pt-4 font-bold transition-all duration-500"
    >
      {{ headerName }}
    </h1>
    <IconOrganizationStatus
      v-if="headerStatus"
      :status="headerStatus"
      :organization="organization"
    />
  </div>
  <div
    class="flex w-full grow flex-col items-start justify-between space-y-4 pt-2 lg:flex-row lg:items-center lg:space-y-0 xl:pt-4"
  >
    <h2
      v-if="organization && organization.status === 'pending'"
      class="responsive-h4 text-light-warn-yellow dark:text-dark-warn-yellow transition-all duration-500"
    >
      {{ $t("components.header-app-page.status-pending") }}
    </h2>
    <h2
      v-else-if="headerTagline"
      class="responsive-h4 text-light-distinct-text dark:text-dark-distinct-text transition-all duration-500"
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

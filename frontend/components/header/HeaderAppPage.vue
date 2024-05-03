<template>
  <PageBreadcrumbs
    class="mt-4 hidden md:block"
    :organization="organization"
    :group="group"
    :event="event"
  />
  <div
    v-if="underDevelopment"
    class="mt-5 flex w-full flex-wrap rounded-md border border-light-text bg-light-warn-yellow/40 px-3 py-1 text-light-text dark:border-dark-warn-yellow dark:bg-dark-warn-yellow/30 dark:text-dark-warn-yellow"
  >
    <div class="flex space-x-3">
      <p>🚧</p>
      <div class="flex flex-col space-y-1">
        <p>{{ $t("components.header-app-page.under-development") }}</p>
        <div class="flex space-x-3">
          <a
            class="focus-brand link-text flex items-center space-x-1"
            href="https://github.com/activist-org/activist"
            target="_blank"
          >
            <p>{{ $t("components._global.github") }}</p>
            <Icon
              class="mb-1"
              :name="IconMap.EXTERNAL_LINK"
              size="1em"
              style="vertical-align: baseline"
            />
          </a>
          <p>•</p>
          <a
            class="focus-brand link-text flex items-center space-x-1"
            href="https://matrix.to/#/#activist_community:matrix.org"
            target="_blank"
          >
            <p>{{ $t("components._global.matrix") }}</p>
            <Icon
              class="mb-1"
              :name="IconMap.EXTERNAL_LINK"
              size="1em"
              style="vertical-align: baseline"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="flex items-baseline gap-2 md:gap-4">
    <h1
      class="responsive-h1 pt-4 font-bold text-light-text transition-all duration-500 dark:text-dark-text"
    >
      {{ headerName }}
    </h1>
    <!-- <IconOrganizationStatus
      v-if="headerStatus && organization"
      :status="headerStatus"
      :organization="organization"
    /> -->
  </div>
  <div
    class="flex w-full grow flex-col items-start justify-between space-y-4 pt-2 lg:flex-row lg:items-center lg:space-y-0 xl:pt-4"
  >
    <!-- organization.status === 1 means it's application is pending. -->
    <h2
      v-if="organization && organization.status === 1"
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
import type { Group } from "~/types/group";
import { IconMap } from "~/types/icon-map";
import type { Organization } from "~/types/organization";

const props = defineProps<{
  header?: string;
  tagline?: string;
  organization?: Organization;
  group?: Group;
  event?: Event;
  underDevelopment?: boolean;
}>();

const headerName = computed<string>(() => {
  if (props.header) {
    return props.header;
  } else if (props.organization) {
    return props.organization.name;
  } else if (props.group) {
    return props.group.name;
  } else if (props.event) {
    return props.event.name;
  } else {
    return "";
  }
});

const headerTagline = computed<string>(() => {
  if (props.tagline) {
    return props.tagline;
  } else if (props.organization && props.organization.tagline) {
    return props.organization.tagline;
  } else if (props.group && props.group.tagline) {
    return props.group.tagline;
  } else if (props.event && props.event.tagline) {
    return props.event.tagline;
  } else {
    return "";
  }
});

// const headerStatus = computed<number>(() => {
//   if (props.organization) {
//     return props.organization.status;
//   } else {
//     return 1;
//   }
// });
</script>

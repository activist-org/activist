<template>
  <PageBreadcrumbs class="mt-4 hidden md:block" :pageType="pageType" />
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
import type { Organization } from "~/types/entities/organization";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  header?: string;
  tagline?: string;
  pageType?: "organization" | "group" | "event";
  underDevelopment?: boolean;
}>();

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const organizationStore = useOrganizationStore();
let organization: Organization;
const group = useGroupStore();
const event = useEventStore();

if (props.pageType === "organization") {
  await organizationStore.fetchByID(id);
  organization = organizationStore.organization;
} else if (props.pageType === "group") {
  await group.fetchByID(id);
} else if (props.pageType === "event") {
  await event.fetchByID(id);
}

const headerName = computed<string>(() => {
  if (props.header) {
    return props.header;
  } else if (props.pageType === "organization") {
    return organization.name;
  } else if (props.pageType === "group") {
    return group.name;
  } else if (props.pageType === "event") {
    return event.name;
  } else {
    return "";
  }
});

const headerTagline = computed(() => {
  if (props.tagline) {
    return props.tagline;
  } else if (props.pageType === "organization") {
    return organization.tagline;
  } else if (props.pageType === "group") {
    return group.tagline;
  } else if (props.pageType === "event") {
    return event.tagline;
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

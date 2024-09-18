<template>
  <nav :aria-label="$t('components.page_breadcrumbs.aria_label')">
    <ul class="flex flex-row flex-wrap text-sm md:text-base">
      <li
        v-for="(breadcrumb, index) in displayBreadcrumbs"
        :key="index"
        class="flex items-center font-display"
      >
        <NuxtLink
          v-if="index === 0"
          class="focus-brand mx-[0.35rem] text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text dark:hover:text-dark-text"
          :to="localePath('/home')"
        >
          &#60;
        </NuxtLink>
        <span
          v-else
          class="mx-[0.45rem] mb-[0.2rem] text-light-distinct-text dark:text-dark-distinct-text"
          >|</span
        >
        <span v-if="index !== displayBreadcrumbs.length - 1">
          <NuxtLink
            v-if="isValidUUID(breadcrumb) && pageType == 'event'"
            class="focus-brand text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text dark:hover:text-dark-text"
            :to="makeURL(breadcrumb)"
          >
            {{ event.name }}
          </NuxtLink>
          <NuxtLink
            v-else-if="isValidUUID(breadcrumb) && pageType == 'organization'"
            class="focus-brand text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text dark:hover:text-dark-text"
            :to="makeURL(breadcrumb)"
          >
            {{ organization.name }}
          </NuxtLink>
          <NuxtLink
            v-else-if="
              isValidUUID(breadcrumb) && pageType == 'group' && index == 1
            "
            class="focus-brand text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text dark:hover:text-dark-text"
            :to="makeURL(breadcrumb)"
          >
            {{ group.name }}
          </NuxtLink>
          <NuxtLink
            v-else-if="
              isValidUUID(breadcrumb) && pageType == 'group' && index == 3
            "
            class="focus-brand text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text dark:hover:text-dark-text"
            :to="makeURL(breadcrumb)"
          >
            {{ group.name }}
          </NuxtLink>
          <NuxtLink
            v-else
            class="focus-brand text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text dark:hover:text-dark-text"
            :to="makeURL(breadcrumb)"
          >
            {{ capitalizeFirstLetter(breadcrumb) }}
          </NuxtLink>
        </span>
        <span v-else>
          <NuxtLink
            class="focus-brand text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text dark:hover:text-dark-text"
            :to="makeURL(breadcrumb)"
            aria-current="page"
          >
            {{ capitalizeFirstLetter(breadcrumb) }}
          </NuxtLink>
        </span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { validate as isValidUUID } from "uuid";
import type { Organization } from "~/types/entities/organization";
import type { Event } from "~/types/events/event";

const url = window.location.href;
let pageType = "";

const { locales } = useI18n();
const localePath = useLocalePath();

const paramsID = useRoute().params.id;
const paramsIDGroup = useRoute().params.groupID;

const id = typeof paramsID === "string" ? paramsID : undefined;
const idGroup = typeof paramsIDGroup === "string" ? paramsIDGroup : undefined;

const organizationStore = useOrganizationStore();
let organization: Organization;
const group = useGroupStore();
const eventStore = useEventStore();
let event: Event;

if (
  url.includes("/organizations/") &&
  !url.includes("/groups/") &&
  !url.includes("/organizations/create") &&
  !url.includes("/organizations/search")
) {
  pageType = "organization";
  await organizationStore.fetchByID(id);
  organization = organizationStore.organization;
} else if (url.includes("/organizations/") && url.includes("/groups/")) {
  pageType = "group";
  await group.fetchByID(idGroup);
} else if (
  url.includes("/events/") &&
  !url.includes("/organizations/") &&
  !url.includes("/groups/") &&
  !url.includes("/events/create") &&
  !url.includes("/events/search")
) {
  pageType = "event";
  await eventStore.fetchByID(id);
  event = eventStore.event;
}

const breadcrumbs = ref<string[]>([]);

function setBreadcrumbs() {
  const url = window.location.pathname;
  const nonEmptySegments = getNonEmptySegmentsFromURL(url);
  breadcrumbs.value = nonEmptySegments;
}

function getNonEmptySegmentsFromURL(url: string) {
  const segments = url.split("/");
  const nonEmptySegments = segments.filter((segment) => segment);
  return nonEmptySegments;
}

onMounted(() => {
  setBreadcrumbs();
});

function isLocaleSegment(segment: string) {
  return locales.value.some((locale) =>
    typeof locale === "string" ? locale === segment : locale.code === segment
  );
}

const displayBreadcrumbs = computed(() => {
  return breadcrumbs.value.filter((segment) => !isLocaleSegment(segment));
});

function makeURL(breadcrumb: string) {
  const clickedBreadcrumbIndex = breadcrumbs.value.indexOf(breadcrumb);
  const segmentsForURL = breadcrumbs.value.slice(0, clickedBreadcrumbIndex + 1);
  const url = "/" + segmentsForURL.join("/");
  return url;
}

function capitalizeFirstLetter(string: string) {
  if (string === "activist") {
    return string;
  } else if (string !== "activist" && string.includes("-")) {
    return string
      .replace("-", " ")
      .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  } else {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
</script>

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
          class="focus-brand mx-[0.35rem] text-distinct-text hover:text-primary-text"
          :to="localePath('/home')"
        >
          &#60;
        </NuxtLink>
        <span v-else class="mx-[0.45rem] mb-[0.2rem] text-distinct-text"
          >|</span
        >
        <span v-if="index !== displayBreadcrumbs.length - 1">
          <NuxtLink
            v-if="isValidUUID(breadcrumb) && pageType == 'event'"
            class="focus-brand text-distinct-text hover:text-primary-text"
            :to="makeURL(breadcrumb)"
          >
            {{ event.name }}
          </NuxtLink>
          <NuxtLink
            v-else-if="isValidUUID(breadcrumb) && pageType == 'organization'"
            class="focus-brand text-distinct-text hover:text-primary-text"
            :to="makeURL(breadcrumb)"
          >
            {{ organization.name }}
          </NuxtLink>
          <NuxtLink
            v-else-if="
              isValidUUID(breadcrumb) && pageType == 'group' && index == 1
            "
            class="focus-brand text-distinct-text hover:text-primary-text"
            :to="makeURL(breadcrumb)"
          >
            {{ group.name }}
          </NuxtLink>
          <NuxtLink
            v-else-if="
              isValidUUID(breadcrumb) && pageType == 'group' && index == 3
            "
            class="focus-brand text-distinct-text hover:text-primary-text"
            :to="makeURL(breadcrumb)"
          >
            {{ group.name }}
          </NuxtLink>
          <NuxtLink
            v-else
            class="focus-brand text-distinct-text hover:text-primary-text"
            :to="makeURL(breadcrumb)"
          >
            {{ capitalizeFirstLetter(breadcrumb) }}
          </NuxtLink>
        </span>
        <span v-else>
          <NuxtLink
            class="focus-brand text-distinct-text hover:text-primary-text"
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
import type { Group } from "~/types/entities/group";
import type { Organization } from "~/types/entities/organization";
import type { Event } from "~/types/events/event";

const url = window.location.href;
let pageType = "";

const { locales } = useI18n();
const localePath = useLocalePath();

const paramsId = useRoute().params.id;
const paramsIdGroup = useRoute().params.groupId;

const id = typeof paramsId === "string" ? paramsId : undefined;
const idGroup = typeof paramsIdGroup === "string" ? paramsIdGroup : undefined;

const organizationStore = useOrganizationStore();
const groupStore = useGroupStore();
const eventStore = useEventStore();

let organization: Organization;
let group: Group;
let event: Event;

const groupRegex = /^(http:\/\/localhost:\d+|https?:\/\/[\w.-]+)(\/[a-z]{2})?\/organizations\/[0-9a-fA-F-]+\/groups\/([0-9a-fA-F-]+)(\/about)?$/;
const eventRegex = /^(http:\/\/localhost:\d+|https?:\/\/[\w.-]+)(\/[a-z]{2})?\/events\/([0-9a-fA-F-]+)(\/about)?$/;

if (
  url.includes("/organizations/") &&
  !url.includes("/groups/") &&
  !url.includes("/organizations/create") &&
  !url.includes("/organizations/search")
) {
  pageType = "organization";
  await organizationStore.fetchById(id);
  organization = organizationStore.organization;
} else if (groupRegex.test(url)) {
  pageType = "group";

  const match = url.match(groupRegex);
  const groupId = match ? match[4] : null;

  if (groupId) {
    await groupStore.fetchById(groupId);
    group = groupStore.group;
  }
} else if (eventRegex.test(url)) {
  pageType = "event";

  const match = url.match(eventRegex);
  const eventId = match ? match[3] : null;

  if (eventId) {
    await eventStore.fetchById(eventId);
    event = eventStore.event;
  }
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

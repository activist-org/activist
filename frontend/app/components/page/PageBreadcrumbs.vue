<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <nav :aria-label="$t('i18n.components.page_breadcrumbs.aria_label')">
    <ul class="flex flex-row flex-wrap text-sm md:text-base">
      <li
        v-for="(breadcrumb, index) in displayBreadcrumbs"
        :key="index"
        class="flex items-center font-display"
      >
        <NuxtLink
          v-if="index === 0"
          class="mx-[0.35rem] text-distinct-text focus-brand hover:text-primary-text"
          :to="localePath('/home')"
        >
          &#60;
        </NuxtLink>
        <span v-else class="mx-[0.45rem] mb-[0.2rem] text-distinct-text">
          |
        </span>
        <span v-if="index !== displayBreadcrumbs.length - 1">
          <NuxtLink
            v-if="isValidUUID(breadcrumb) && pageType == 'event'"
            class="text-distinct-text focus-brand hover:text-primary-text"
            :to="makeURL(breadcrumb)"
          >
            {{ event.name }}
          </NuxtLink>
          <NuxtLink
            v-else-if="isValidUUID(breadcrumb) && pageType == 'organization'"
            class="text-distinct-text focus-brand hover:text-primary-text"
            :to="makeURL(breadcrumb)"
          >
            {{ organization.name }}
          </NuxtLink>
          <NuxtLink
            v-else-if="
              isValidUUID(breadcrumb) && pageType == 'group' && index == 1
            "
            class="text-distinct-text focus-brand hover:text-primary-text"
            :to="makeURL(breadcrumb)"
          >
            {{ group.org.name }}
          </NuxtLink>
          <NuxtLink
            v-else-if="
              isValidUUID(breadcrumb) && pageType == 'group' && index == 3
            "
            class="text-distinct-text focus-brand hover:text-primary-text"
            :to="makeURL(breadcrumb)"
          >
            {{ group.name }}
          </NuxtLink>
          <NuxtLink
            v-else
            class="text-distinct-text focus-brand hover:text-primary-text"
            :to="makeURL(breadcrumb)"
          >
            {{ capitalizeFirstLetter(breadcrumb) }}
          </NuxtLink>
        </span>
        <span v-else>
          <NuxtLink
            aria-current="page"
            class="text-distinct-text focus-brand hover:text-primary-text"
            :to="makeURL(breadcrumb)"
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

import { getGroup } from "~/services/communities/group/group";
import { getOrganization } from "~/services/communities/organization/organization";
import { getEvent } from "~/services/event/event";

const url = window.location.href;
let pageType = "";

const { locales } = useI18n();
const localePath = useLocalePath();

const paramsOrgId = useRoute().params.orgId;
const paramsGroupId = useRoute().params.groupId;
const paramsEventId = useRoute().params.eventId;

const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : "";
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;

const organizationStore = useOrganizationStore();
const groupStore = useGroupStore();
const eventStore = useEventStore();

let organization: Organization;
let group: Group;
let event: CommunityEvent;

// Note: UUID Regex: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.
const organizationRegex =
  /^(http:\/\/localhost:\d+|https?:\/\/[\w.-]+)(\/[a-z]{2})?\/organizations\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.+$/;
const groupRegex =
  /^(http:\/\/localhost:\d+|https?:\/\/[\w.-]+)(\/[a-z]{2})?\/organizations\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/groups\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}).+$/;
const eventRegex =
  /^(http:\/\/localhost:\d+|https?:\/\/[\w.-]+)(\/[a-z]{2})?\/events\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}).+$/;

// Note: We need to test for groups before organizations as the org test passes for groups.
if (groupRegex.test(url)) {
  pageType = "group";

  if (groupStore.group) group = groupStore.group;
  else group = await getGroup(groupId);
} else if (organizationRegex.test(url)) {
  pageType = "organization";

  if (organizationStore.organization)
    organization = organizationStore.organization;
  else organization = await getOrganization(orgId || "");
} else if (eventRegex.test(url)) {
  pageType = "event";

  if (eventStore.event) event = eventStore.event;
  else event = await getEvent(eventId || "");
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

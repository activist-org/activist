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

/**
 * Sets the breadcrumbs based on the current URL. This function parses the URL to extract the relevant segments, filters out any empty segments, and updates the breadcrumbs state accordingly. The breadcrumbs are then used to display the navigation path to the user, allowing them to easily understand their location within the application and navigate back to previous pages if needed.
 */
function setBreadcrumbs() {
  const url = window.location.pathname;
  const nonEmptySegments = getNonEmptySegmentsFromURL(url);
  breadcrumbs.value = nonEmptySegments;
}

/**
 * Extracts the non-empty segments from a given URL. This function takes a URL as input, splits it into segments based on the "/" delimiter, and filters out any empty segments that may result from leading, trailing, or consecutive slashes. The resulting array of non-empty segments is returned, which can then be used for various purposes such as setting breadcrumbs or determining the structure of the URL.
 * @param url The URL from which to extract the non-empty segments. This is typically the current page's URL, and the function will process it to identify the relevant segments that represent the navigation path within the application. The function ensures that only meaningful segments are returned, providing a clean and accurate representation of the URL structure for use in features like breadcrumbs.
 * @returns An array of non-empty segments extracted from the URL. Each segment represents a part of the URL path that is relevant for navigation or display purposes. This array can be used to set breadcrumbs or for other functionalities that require an understanding of the URL structure, allowing for a more user-friendly navigation experience within the application.
 */
function getNonEmptySegmentsFromURL(url: string) {
  const segments = url.split("/");
  const nonEmptySegments = segments.filter((segment) => segment);
  return nonEmptySegments;
}

onMounted(() => {
  setBreadcrumbs();
});

/**
 * Determines whether a given segment of the URL is a locale segment. This function checks if the provided segment matches any of the defined locales in the application, which can be either strings or objects with a code property. By identifying locale segments, the function helps to filter them out from the breadcrumbs, ensuring that only relevant navigation segments are displayed to the user. This contributes to a clearer and more user-friendly breadcrumb navigation experience.
 * @param segment The segment of the URL to check for being a locale. This is typically a part of the URL that may represent the language or regional setting of the application, such as "en" for English or "fr" for French. The function compares this segment against the list of defined locales to determine if it should be considered a locale segment, which can then be excluded from the breadcrumbs to maintain a clean navigation path for the user.
 * @returns A boolean value indicating whether the provided segment is a locale segment. This return value is used to filter out locale segments from the breadcrumbs, ensuring that only meaningful navigation segments are displayed to the user. By accurately identifying locale segments, the function helps to enhance the clarity and usability of the breadcrumb navigation within the application.
 */
function isLocaleSegment(segment: string) {
  return locales.value.some((locale) =>
    typeof locale === "string" ? locale === segment : locale.code === segment
  );
}

const displayBreadcrumbs = computed(() => {
  return breadcrumbs.value.filter((segment) => !isLocaleSegment(segment));
});

/**
 * Constructs a URL based on the clicked breadcrumb segment. This function takes a breadcrumb segment as input, identifies its index in the breadcrumbs array, and constructs a URL that corresponds to that segment by joining the relevant segments together. The resulting URL allows users to navigate back to the page represented by the clicked breadcrumb, providing an intuitive way to move through the application's navigation hierarchy.
 * @param breadcrumb The breadcrumb segment that was clicked by the user. This segment is used to determine the target URL for navigation, allowing the user to return to a previous page in the application's structure. The function calculates the appropriate URL based on the position of the clicked breadcrumb within the breadcrumbs array, ensuring that the navigation path is accurate and reflects the user's intended destination.
 * @returns A string representing the URL corresponding to the clicked breadcrumb segment. This URL is constructed by joining the relevant segments of the breadcrumbs array up to the index of the clicked segment, providing a valid path for navigation within the application. By generating this URL, the function enables users to easily navigate back to previous pages, enhancing the overall user experience and making it easier to explore the application's content.
 */
function makeURL(breadcrumb: string) {
  const clickedBreadcrumbIndex = breadcrumbs.value.indexOf(breadcrumb);
  const segmentsForURL = breadcrumbs.value.slice(0, clickedBreadcrumbIndex + 1);
  const url = "/" + segmentsForURL.join("/");
  return url;
}

/**
 * Capitalizes the first letter of a given string. This function takes a string as input and returns a new string with the first letter capitalized. If the string contains a hyphen, it replaces the hyphen with a space and capitalizes the first letter of each word. This function is useful for formatting breadcrumb segments or other text elements in the application to ensure a consistent and user-friendly display.
 * @param string The string to be capitalized. This is typically a segment of a breadcrumb or other text element that needs to be formatted for display. The function processes this string to apply the appropriate capitalization rules, enhancing the readability and visual appeal of the text.
 * @returns A string with the first letter capitalized and hyphens replaced with spaces, if applicable. This formatted string is suitable for display in breadcrumb navigation or other UI elements where a user-friendly representation of the text is desired.
 */
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

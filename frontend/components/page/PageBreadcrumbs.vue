<template>
  <nav :aria-label="$t('components.page-breadcrumbs.aria-label')">
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
          <a
            v-if="Number.isInteger(Number(breadcrumb)) && event"
            class="focus-brand text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text dark:hover:text-dark-text"
            :href="makeURL(breadcrumb)"
          >
            {{ event.name }}
          </a>
          <a
            v-else-if="Number.isInteger(Number(breadcrumb)) && organization"
            class="focus-brand text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text dark:hover:text-dark-text"
            :href="makeURL(breadcrumb)"
          >
            {{ organization.name }}
          </a>
          <a
            v-else-if="
              Number.isInteger(Number(breadcrumb)) && group && index == 1
            "
            class="focus-brand text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text dark:hover:text-dark-text"
            :href="makeURL(breadcrumb)"
          >
            {{ group.organization }}
          </a>
          <a
            v-else-if="
              Number.isInteger(Number(breadcrumb)) && group && index == 3
            "
            class="focus-brand text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text dark:hover:text-dark-text"
            :href="makeURL(breadcrumb)"
          >
            {{ group.name }}
          </a>
          <a
            v-else
            class="focus-brand text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text dark:hover:text-dark-text"
            :href="makeURL(breadcrumb)"
          >
            {{ capitalizeFirstLetter(breadcrumb) }}
          </a>
        </span>
        <span v-else>
          <a
            class="focus-brand text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text dark:hover:text-dark-text"
            :href="makeURL(breadcrumb)"
            aria-current="page"
          >
            {{ capitalizeFirstLetter(breadcrumb) }}
          </a>
        </span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { Event } from "~/types/event";
import type { Group } from "~/types/group";
import type { Organization } from "~/types/organization";
const { locales } = useI18n();
const localePath = useLocalePath();

defineProps<{
  organization?: Organization;
  group?: Group;
  event?: Event;
}>();

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

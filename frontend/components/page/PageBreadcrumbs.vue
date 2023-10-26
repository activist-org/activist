<template>
  <nav :aria-label="$t('components.page-breadcrumbs.aria-label')">
    <ul class="flex flex-row flex-wrap text-sm md:text-base">
      <li
        v-for="(breadcrumb, index) in displayBreadcrumbs"
        :key="index"
        class="flex items-center font-display"
      >
        <span
          v-if="index === 0"
          class="mx-[0.35rem] text-light-special-text dark:text-dark-special-text"
          >&#60;</span
        >
        <span
          v-else
          class="mx-[0.45rem] mb-[0.2rem] text-light-special-text dark:text-dark-special-text"
          >|</span
        >
        <span v-if="index !== displayBreadcrumbs.length - 1">
          <a
            v-if="Number.isInteger(Number(breadcrumb)) && event"
            class="text-light-special-text hover:text-light-text dark:text-dark-special-text dark:hover:text-dark-text focus-brand"
            :href="makeURL(breadcrumb)"
          >
            {{ event.name }}
          </a>
          <a
            v-else-if="Number.isInteger(Number(breadcrumb)) && organization"
            class="text-light-special-text hover:text-light-text dark:text-dark-special-text dark:hover:text-dark-text focus-brand"
            :href="makeURL(breadcrumb)"
          >
            {{ organization.name }}
          </a>
          <a
            v-else
            class="text-light-special-text hover:text-light-text dark:text-dark-special-text dark:hover:text-dark-text focus-brand"
            :href="makeURL(breadcrumb)"
          >
            {{ capitalizeFirstLetter(breadcrumb) }}
          </a>
        </span>
        <span v-else>
          <a
            class="text-light-special-text hover:text-light-text dark:text-dark-special-text dark:hover:text-dark-text focus-brand"
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
import { onMounted, ref } from "vue";
import type { Event } from "~/types/event";
import type { Organization } from "~/types/organization";
const { locales } = useI18n();

defineProps<{
  organization?: Organization;
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

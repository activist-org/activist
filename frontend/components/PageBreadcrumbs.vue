<template>
  <nav aria-label="Breadcrumb">
    <ul class="flex flex-row">
      <li
        v-for="(breadcrumb, index) in displayBreadcrumbs"
        :key="index"
        class="font-display"
      >
        <span
          v-if="index !== 0"
          class="mx-2 text-light-special-text dark:text-dark-special-text"
          >/</span
        >
        <span v-if="index !== displayBreadcrumbs.length - 1">
          <a
            v-if="Number.isInteger(Number(breadcrumb)) && event"
            :href="makeURL(breadcrumb)"
            class="text-light-special-text hover:text-light-text dark:text-dark-special-text dark:hover:text-dark-text focus-brand"
          >
            {{ event.name }}
          </a>
          <a
            v-else-if="Number.isInteger(Number(breadcrumb)) && organization"
            :href="makeURL(breadcrumb)"
            class="text-light-special-text hover:text-light-text dark:text-dark-special-text dark:hover:text-dark-text focus-brand"
          >
            {{ organization.name }}
          </a>
          <a
            v-else
            :href="makeURL(breadcrumb)"
            class="text-light-special-text hover:text-light-text dark:text-dark-special-text dark:hover:text-dark-text focus-brand"
          >
            {{ capitalizeFirstLetter(breadcrumb) }}
          </a>
        </span>
        <span v-else>
          <a
            :href="makeURL(breadcrumb)"
            aria-current="page"
            class="text-light-special-text hover:text-light-text dark:text-dark-special-text dark:hover:text-dark-text focus-brand"
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
import type { Event } from "~~/types/event";
import type { Organization } from "~~/types/organization";
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
  return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>

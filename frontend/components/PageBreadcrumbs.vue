<template>
  <nav aria-label="Breadcrumb" class="mt-[1px]">
    <ul class="flex flex-row">
      <li v-for="(breadcrumb, index) in displayBreadcrumbs" :key="index">
        <span class="mx-1 text-base text-light-special-text dark:text-dark-special-text">/</span>
        <a 
          v-if="index !== displayBreadcrumbs.length - 1" :href="makeURL(breadcrumb)"
          class="text-base font-medium text-light-special-text hover:text-light-text dark:text-dark-special-text dark:hover:text-dark-text focus-brand"
        >
          {{ capitalizeFirstLetter(breadcrumb) }}
        </a>
        <span 
          v-else aria-current="page"
          class="text-base font-medium text-light-special-text dark:text-dark-special-text"
        >
          {{ capitalizeFirstLetter(breadcrumb) }}
        </span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const { locales } = useI18n();

const breadcrumbs = ref([]);

function setBreadcrumbs() {
  const url = window.location.pathname;
  const nonEmptySegments = getNonEmptySegmentsFromURL(url);
  breadcrumbs.value = nonEmptySegments;
}

function getNonEmptySegmentsFromURL(url) {
  const segments = url.split('/');
  const nonEmptySegments = segments.filter(segment => segment);
  return nonEmptySegments;
}

onMounted(() => {
  setBreadcrumbs();
});

function isLocaleSegment(segment) {
  return locales.value.some((i) => i.code === segment);
}

const displayBreadcrumbs = computed(() => {
  return breadcrumbs.value.filter((segment) => !isLocaleSegment(segment));
});

function makeURL(breadcrumb) {
  const clickedBreadcrumbIndex = breadcrumbs.value.indexOf(breadcrumb);
  const segmentsForURL = breadcrumbs.value.slice(0, clickedBreadcrumbIndex + 1);
  const url = "/" + segmentsForURL.join('/');
  return url;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>
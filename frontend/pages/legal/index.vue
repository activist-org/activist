<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("_global.legal") }}</Title>
    </Head>
    <div class="bg-light-layer-1 dark:bg-dark-layer-1">
      <div class="responsive-py-4 responsive-px-5 flex w-full flex-col">
        <HeaderAppPage
          :header="$t('_global.legal')"
          :tagline="$t('pages.legal.index.subheader')"
        />
      </div>
    </div>
    <div class="responsive-py-5 responsive-px-5">
      <h3 class="responsive-h2 transition-all duration-500">
        {{ $t("pages.legal.index.section-1-subheader") }}
      </h3>
      <p
        class="responsive-py-1 text-light-distinct-text dark:text-dark-distinct-text"
      >
        {{ $t("pages.legal.index.section-1-tagline") }}
      </p>
      <GridDocEntries class="responsive-py-1" :cards="cards" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DocsEntry } from "~/types/docs-entry";
import useRouteToName from "~/composables/useRouteToName";

const emit = defineEmits(["routeToName"]);
useRouteToName(emit);

const cards: DocsEntry[] = [
  {
    id: 1,
    url: "trademark-policy",
    title: "_global.trademark-policy",
    description: "pages.legal.index.trademark-policy-description",
    imgURL: "/images/content_pages/icons/bootstrap_trademark",
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.legal._global.trademark-policy-alt-text",
  },
  {
    id: 2,
    url: "privacy-policy",
    title: "_global.privacy-policy",
    description: "pages.legal.index.privacy-policy-description",
    imgURL: "/images/content_pages/icons/bootstrap_shield_check",
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.legal._global.privacy-policy-alt-text",
  },
];
</script>

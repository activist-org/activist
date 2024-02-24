<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("_global.about") }}</Title>
    </Head>
    <div class="bg-light-distinct dark:bg-dark-distinct">
      <div class="flex flex-col w-full responsive-py-4 responsive-px-5">
        <HeaderAppPage
          :header="$t('_global.about')"
          :tagline="$t('pages.about.index.subheader')"
        />
      </div>
    </div>
    <div class="responsive-py-5 responsive-px-5">
      <h3 class="transition-all duration-500 responsive-h2">
        {{ $t("pages.about.index.section-1-subheader") }}
      </h3>
      <p
        class="responsive-py-1 text-light-distinct-text dark:text-dark-distinct-text"
      >
        {{ $t("pages.about.index.section-1-tagline") }}
      </p>
      <GridDocEntries class="responsive-py-1" :cards="cards" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DocsEntry } from "~/types/card-docs-entry";

const cards: DocsEntry[] = [
  {
    id: 1,
    url: "activist",
    title: "pages.about.index.activist",
    description: "pages.about.index.activist-description",
    imgURL: "/images/content_pages/icons/activist_icon",
    imgDimensions: "h-12 sm:h-16",
    imgAltText: "_global.activist-icon-img-alt-text",
  },
  {
    id: 2,
    url: "impress",
    title: "_global.imprint",
    description: "pages.about.index.imprint-description",
    imgURL: "/images/content_pages/icons/bootstrap_info_circle",
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.about._global.imprint-img-alt-text",
  },
  {
    id: 3,
    url: "roadmap",
    title: "_global.roadmap",
    description: "_global.roadmap-description",
    imgURL: "/images/content_pages/icons/arcticons_bike_location",
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.about._global.roadmap-img-alt-text",
  },
];
</script>

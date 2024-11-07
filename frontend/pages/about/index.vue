<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("_global.about") }}</Title>
    </Head>
    <div class="bg-light-layer-1 dark:bg-dark-layer-1">
      <div class="responsive-py-4 responsive-px-5 flex w-full flex-col">
        <HeaderAppPage
          :header="$t('_global.about')"
          :tagline="$t('pages.about.index.subheader')"
        />
      </div>
    </div>
    <div class="responsive-py-5 responsive-px-5">
      <h3 class="responsive-h2 transition-all duration-500">
        {{ $t("pages.about.index.section_1_subheader") }}
      </h3>
      <p
        class="responsive-py-1 text-light-distinct-text dark:text-dark-distinct-text"
      >
        {{ $t("pages.about.index.section_1_tagline") }}
      </p>
      <GridDocEntries class="responsive-py-1" :cards="cards" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DocsEntry } from "~/types/docs-entry";

const cards: DocsEntry[] = [
  {
    id: 1,
    url: "activist",
    title: "pages.about.index.activist",
    description: "pages.about.index.activist_description",
    imgUrl: "/icons/activist/activist_icon",
    imgDimensions: "h-12 sm:h-16",
    imgAltText: "_global.activist_icon_img_alt_text",
  },
  {
    id: 2,
    url: "imprint",
    title: "_global.imprint",
    description: "pages.about.index.imprint_description",
    imgUrl: `${BOOTSTRAP_INFO_CIRCLE_URL}`,
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.about._global.imprint_img_alt_text",
  },
  {
    id: 3,
    url: "roadmap",
    title: "_global.roadmap",
    description: "pages.about.index.roadmap_description",
    imgUrl: `${ARCTICONS_BIKE_LOCATION}`,
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.about._global.roadmap_img_alt_text",
  },
];
</script>

<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.about.index.title") }}</Title>
    </Head>
    <div class="bg-light-distinct dark:bg-dark-distinct">
      <div class="flex flex-col w-full responsive-py-4 responsive-px-5">
        <HeaderAppPage
          :header="$t('pages.about.index.header')"
          :tagline="$t('pages.about.index.subheader')"
        />
      </div>
    </div>
    <div class="responsive-py-5 responsive-px-5">
      <h3 class="transition-all duration-500 responsive-h2">
        {{ $t("pages.about.index.section-1-subheader") }}
      </h3>
      <p
        class="responsive-py-1 text-light-special-text dark:text-dark-special-text"
      >
        {{ $t("pages.about.index.section-1-tagline") }}
      </p>
      <GridDocEntries class="responsive-py-1" :cards="cards" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardDocsEntry } from "../../types/card-docs-entry";

const cards: CardDocsEntry[] = [
  {
    id: 1,
    url: "activist",
    title: "pages.about.index.activist",
    description: "pages.about.index.activist-description",
    imgURL: "/images/content_pages/icons/activist_icon",
    imgDimensions: "h-12 sm:h-16",
    imgAltText: "pages.about.index.activist-alt-text",
  },
  {
    id: 2,
    url: "impress",
    title: "pages.about.index.impress",
    description: "pages.about.index.impress-description",
    imgURL: "/images/content_pages/icons/bootstrap_info_circle",
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.about.index.impress-alt-text",
  },
  {
    id: 3,
    url: "roadmap",
    title: "pages.about.index.roadmap",
    description: "pages.about.index.roadmap-description",
    imgURL: "/images/content_pages/icons/arcticons_bike_location",
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.about.index.roadmap-alt-text",
  },
];
</script>

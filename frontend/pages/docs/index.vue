<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("_global.documentation") }}</Title>
    </Head>
    <div class="bg-light-layer-1 dark:bg-dark-layer-1">
      <div class="responsive-py-4 responsive-px-5 flex w-full flex-col">
        <HeaderAppPage
          :header="$t('_global.documentation')"
          :tagline="$t('pages.docs.index.subheader')"
        />
      </div>
    </div>
    <div class="responsive-py-5 responsive-px-5">
      <h3 class="responsive-h2 transition-all duration-500">
        {{ $t("pages.docs.index.section_1_subheader") }}
      </h3>
      <p
        class="responsive-py-1 text-light-distinct-text dark:text-dark-distinct-text"
      >
        {{ $t("pages.docs.index.section_1_tagline") }}
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
    url: "get-active",
    title: "pages.docs.index.get_active",
    description: "pages.docs.index.get_active_description",
    imgURL: `${GET_ACTIVE_IMAGE_URL}`,
    imgDimensions: "h-20 sm:h-24",
    imgAltText: "pages._global.get_active_img_alt_text",
  },
  {
    id: 2,
    url: "get-organized",
    title: "pages.docs.index.get_organized",
    description: "pages.docs.index.get_organized_description",
    imgURL: `${GET_ORGANIZED_IMAGE_URL}`,
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages._global.get_organized_img_alt_text",
  },
  {
    id: 3,
    url: "grow-organization",
    title: "pages.docs.index.grow_organization",
    description: "pages.docs.index.grow_organization_description",
    imgURL: `${GROW_ORGANIZATION_IMAGE_URL}`,
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages._global.grow_organization_img_alt_text",
  },
];
</script>

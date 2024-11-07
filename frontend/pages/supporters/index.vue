<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("_global.supporters") }}</Title>
    </Head>
    <div class="bg-light-layer-1 dark:bg-dark-layer-1">
      <div class="responsive-py-4 responsive-px-5 flex w-full flex-col">
        <HeaderAppPage
          :header="$t('_global.supporters')"
          :tagline="$t('pages.supporters.index.subheader')"
        />
      </div>
    </div>
    <div class="responsive-py-5 responsive-px-5">
      <h3 class="responsive-h2 transition-all duration-500">
        {{ $t("pages._global.our_network") }}
      </h3>
      <p
        class="responsive-py-1 text-light-distinct-text dark:text-dark-distinct-text"
      >
        {{ $t("pages.supporters.index.section_1_tagline") }}
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
    url: "showcase",
    title: "pages.supporters.index.showcase",
    description: "pages.supporters.index.showcase_description",
    imgUrl: `${BOOTSTRAP_HEART_URL}`,
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.supporters.index.showcase_alt_text",
  },
  {
    id: 2,
    url: "join",
    title: "pages._global.become_supporter",
    description: "pages.supporters.index.join_description",
    imgUrl: `${BOOTSTRAP_MODIFIED_JOIN_ICON_URL}`,
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.supporters._global.join_img_alt_text",
  },
];
</script>

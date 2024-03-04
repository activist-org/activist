<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0"
  >
    <Head>
      <Title>{{ $t("_global.supporters") }}</Title>
    </Head>
    <div class="bg-light-layer-1 dark:bg-dark-layer-1">
      <div class="flex flex-col w-full responsive-py-4 responsive-px-5">
        <HeaderAppPage
          :header="$t('_global.supporters')"
          :tagline="$t('pages.supporters.index.subheader')"
        />
      </div>
    </div>
    <div class="responsive-py-5 responsive-px-5">
      <h3
        class="transition-all motion-reduce:transition-none duration-500 responsive-h2"
      >
        {{ $t("pages._global.our-network") }}
      </h3>
      <p
        class="responsive-py-1 text-light-distinct-text dark:text-dark-distinct-text"
      >
        {{ $t("pages.supporters.index.section-1-tagline") }}
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
    url: "showcase",
    title: "pages.supporters.index.showcase",
    description: "pages.supporters.index.showcase-description",
    imgURL: "/images/content_pages/icons/bootstrap_heart",
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.supporters.index.showcase-alt-text",
  },
  {
    id: 2,
    url: "join",
    title: "pages._global.become-supporter",
    description: "pages.supporters.index.join-description",
    imgURL: "/images/content_pages/icons/join_icon",
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.supporters._global.join-img-alt-text",
  },
];
</script>

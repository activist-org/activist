<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.legal.index.title") }}</Title>
    </Head>
    <div class="bg-light-distinct dark:bg-dark-distinct">
      <div class="responsive-py-4 flex flex-col w-full responsive-px-5">
        <HeaderAppPage
          :header="$t('pages.legal.index.header')"
          :tagline="$t('pages.legal.index.subheader')"
        />
      </div>
    </div>
    <div class="responsive-py-5 responsive-px-5">
      <h3 class="transition-all duration-500 responsive-h2">
        {{ $t("pages.legal.index.section-1-subheader") }}
      </h3>
      <p
        class="responsive-py-1 text-light-special-text dark:text-dark-special-text"
      >
        {{ $t("pages.legal.index.section-1-tagline") }}
      </p>
      <GridDocEntries class="responsive-py-1" :cards="cards" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardDocsEntry } from "../../types/card-docs-entry";

const cards: CardDocsEntry[] = [
  {
    url: "/trademark-policy",
    title: "pages.legal.index.trademark-policy",
    description: "pages.legal.index.trademark-policy-description",
    imgURL: "/images/content_pages/icons/bootstrap_trademark",
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.legal.index.trademark-policy-alt-text",
  },
  {
    url: "/privacy-policy",
    title: "pages.legal.index.privacy-policy",
    description: "pages.legal.index.privacy-policy-description",
    imgURL: "/images/content_pages/icons/bootstrap_shield_check",
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.legal.index.privacy-policy-alt-text",
  },
];
</script>

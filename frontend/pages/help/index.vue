<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("_global.help") }}</Title>
    </Head>
    <div class="bg-light-layer-1 dark:bg-dark-layer-1">
      <div class="responsive-py-4 responsive-px-5 flex w-full flex-col">
        <HeaderAppPage
          :header="$t('_global.help')"
          :tagline="$t('pages.help.index.subheader')"
        />
      </div>
    </div>
    <div class="responsive-py-5 responsive-px-5">
      <h3 class="responsive-h2 transition-all duration-500">
        {{ $t("pages.help.index.section_1_subheader") }}
      </h3>
      <p
        class="responsive-py-1 text-light-distinct-text dark:text-dark-distinct-text"
      >
        {{ $t("pages.help.index.section_1_tagline") }}
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
    url: "faq",
    title: "pages.help._global.frequently_asked_questions",
    description: "pages.help.index.faq_description",
    imgUrl: `${BOOTSTRAP_QUESTION_SQUARE_URL}`,
    imgDimensions: "h-14 sm:h-16",
    imgAltText: "pages.help._global.faq_img_alt_text",
  },
  {
    id: 2,
    url: "contact",
    title: "pages.help.index.contact",
    description: "pages.help.index.contact_description",
    imgUrl: `${BOOTSTRAP_ENVELOPE_URL}`,
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.help._global.contact_img_alt_text",
  },
];
</script>

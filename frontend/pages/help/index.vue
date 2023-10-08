<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <head>
      <title>{{ $t("pages.help.index.title") }}</title>
    </head>
    <div class="bg-light-distinct dark:bg-dark-distinct">
      <div class="responsive-py-4 flex flex-col w-full responsive-px-5">
        <headerapppage
          :header="$t('pages.help.index.header')"
          :tagline="$t('pages.help.index.subheader')"
        />
      </div>
    </div>
    <div class="responsive-py-5 responsive-px-5">
      <h3 class="transition-all duration-500 responsive-h2">
        {{ $t("pages.help.index.section-1-subheader") }}
      </h3>
      <p
        class="responsive-py-1 text-light-special-text dark:text-dark-special-text"
      >
        {{ $t("pages.help.index.section-1-tagline") }}
      </p>
      <griddocentries class="responsive-py-1" :cards="cards" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { carddocsentry } from "../../types/card-docs-entry";

const cards: carddocsentry[] = [
  {
    url: "faq",
    title: "pages.help.index.faq",
    description: "pages.help.index.faq-description",
    imgURL: "/images/content_pages/icons/bootstrap_question_square",
    imgDimensions: "h-14 sm:h-16",
    imgAltText: "pages.help.index.faq-alt-text",
  },
  {
    url: "contact",
    title: "pages.help.index.contact",
    description: "pages.help.index.contact-description",
    imgURL: "/images/content_pages/icons/bootstrap_envelope",
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.help.index.contact-alt-text",
  },
];
</script>

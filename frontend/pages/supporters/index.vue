<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <head>
      <title>{{ $t("pages.supporters.index.title") }}</title>
    </head>
    <div class="bg-light-distinct dark:bg-dark-distinct">
      <div class="responsive-py-4 flex flex-col w-full responsive-px-5">
        <headerapppage
          :header="$t('pages.supporters.index.header')"
          :tagline="$t('pages.supporters.index.subheader')"
        />
      </div>
    </div>
    <div class="responsive-py-5 responsive-px-5">
      <h3 class="transition-all duration-500 responsive-h2">
        {{ $t("pages.supporters.index.section-1-subheader") }}
      </h3>
      <p
        class="responsive-py-1 text-light-special-text dark:text-dark-special-text"
      >
        {{ $t("pages.supporters.index.section-1-tagline") }}
      </p>
      <griddocentries class="responsive-py-1" :cards="cards" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { carddocsentry } from "../../types/card-docs-entry";

const cards: carddocsentry[] = [
  {
    url: "showcase",
    title: "pages.supporters.index.showcase",
    description: "pages.supporters.index.showcase-description",
    imgURL: "/images/content_pages/icons/bootstrap_heart",
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.supporters.index.showcase-alt-text",
  },
  {
    url: "join",
    title: "pages.supporters.index.join",
    description: "pages.supporters.index.join-description",
    imgURL: "/images/content_pages/icons/join_icon",
    imgDimensions: "h-16 sm:h-20",
    imgAltText: "pages.supporters.index.join-alt-text",
  },
];
</script>

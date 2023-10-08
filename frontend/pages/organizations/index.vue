<template>
  <div
    class="px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <head>
      <title>{{ $t("pages.organizations.index.title") }}</title>
    </head>
    <headerapppage
      :header="$t('pages.organizations.index.header')"
      :tagline="$t('pages.organizations.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <topicmarker topic="my topics dropdown" />
      </div>
    </headerapppage>
    <div class="pt-3 pb-6 space-y-6 md:pt-4">
      <cardsearchresult
        searchResultType="organization"
        :isPrivate="false"
        :organization="organization"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { organization } from "../../types/organization";

definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();

const organization: organization = {
  name: "tech from below",
  status: "approved",
  tagline: "technologie von und für soziale bewegungen",
  location: "berlin",
  description: "this is the description of tech from below.",
  topic: "technology and privacy",
  members: 3,
  supporters: 30,
  imageURL: "/images/tech-from-below.svg",
};
</script>

<template>
  <div
    class="px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.organizations.index.title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.organizations.index.header')"
      :tagline="$t('pages.organizations.index.subheader')"
    >
      <TopicMarker topic="My topics dropdown" />
    </HeaderAppPage>
    <div class="pb-4 space-y-4">
      <CardSearchResult
        searchResultType="organization"
        :isPrivate="false"
        :organization="organization"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Organization } from "~~/types/organization";

definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();

const organization: Organization = {
  name: "tech from below",
  location: "Berlin",
  description: "This is the description of tech from below",
  topic: "Technology and Privacy",
  members: 3,
  supporters: 30,
  imageURL: "/images/tech-from-below.svg",
};
</script>

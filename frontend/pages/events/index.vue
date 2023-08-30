<template>
  <div
    class="px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.events.index.title") }} </Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.organizations.index.header')"
      :tagline="$t('pages.organizations.index.subheader')"
    >
      <TopicMarker topic="My topics dropdown" />
    </HeaderAppPage>
    <div class="pb-4 space-y-4">
      <CardSearchResult
        searchResultType="event"
        :isPrivate="false"
        :event="event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Event } from "~~/types/event";

definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();

const event: Event = {
  name: "Test Event",
  type: "act",
  tagline: "We love to test!",
  organizer: "Testers LLC",
  topic: "Testing and Designing",
  description: "This is a test event for testers.",
  getInvolvedDescription: "Wanna help test?",
  onlineLocation: "Zoom Test Room",
  date: new Date(),
  supporters: 10,
};
</script>

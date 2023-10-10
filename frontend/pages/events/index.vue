<template>
  <div
    class="px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.events.index.title") }} </Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.events.index.header')"
      :tagline="$t('pages.events.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <TopicMarker topic="My topics dropdown" />
      </div>
    </HeaderAppPage>
    <div class="pt-3 pb-6 space-y-6 md:pt-4">
      <CardSearchResult
        searchResultType="event"
        :isPrivate="false"
        :event="event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Event } from "../../types/event";

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
  inPersonLocation: "Berlin",
  // onlineLocation: "Zoom Test Room",
  date: new Date(),
  supporters: 10,
};
</script>

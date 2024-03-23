<template>
  <div
    class="bg-light-layer-0 px-8 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("pages.events.index.header-title") }} </Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.events.index.header-title')"
      :tagline="$t('pages.events.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <ShieldTopic topic="My topics dropdown" />
      </div>
    </HeaderAppPage>
    <div v-for="event in events" class="space-y-6 pb-6 pt-3 md:pt-4">
      <CardSearchResult
        searchResultType="event"
        :isPrivate="false"
        :event="event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "sidebar",
});

const { data: events } = await useFetch(
  "http://localhost:8000/v1/entities/events/",
  {
    method: "GET",
  }
);

// import type { Event } from "~/types/event";
// const event: Event = {
//   name: "Test Event",
//   type: "action",
//   tagline: "We love to test!",
//   organizations: ["Testers LLC"],
//   topic: "Testing and Designing",
//   description: "This is a test event for testers.",
//   getInvolvedDescription: "Wanna help test?",
//   inPersonLocation: "Berlin",
//   // onlineLocation: "Zoom Test Room",
//   date: new Date(),
//   supporters: 10,
// };
</script>

<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1
      class="pt-6 font-bold transition-all duration-500 responsive-h1 text-light-text dark:text-dark-text"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      Events home
    </h1>
    <flex class="relative flex items-center py-6"
      ><h2
        class="transition-all duration-500 responsive-h4 text-light-special-text dark:text-dark-special-text"
        :class="{
          'pl-56':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        Upcoming events near you
      </h2>
      <TopicMarker topic="My topics dropdown" class="absolute right-7" />
    </flex>
    <div
      class="pb-4 pr-2 space-y-4 sm:pr-8"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
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
const title = ref("Home");

definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();

const event: Event = {
  name: "Test Event",
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

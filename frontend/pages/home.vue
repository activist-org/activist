<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1
      class="p-4 transition-all duration-500 text-light-text dark:text-dark-text"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      This will be a home page
    </h1>
    <div
      class="pr-2 space-y-4 sm:pr-8"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <CardsSearchResult
        searchResultType="organization"
        :isPrivate="false"
        :organization="organization"
      ></CardsSearchResult>
      <CardsSearchResult
        searchResultType="event"
        :isPrivate="false"
        :event="event"
      ></CardsSearchResult>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Organization } from "~~/types/organization";
import { Event } from "~~/types/event"
const title = ref("Home");

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
}
</script>

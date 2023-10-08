<template>
  <div
    class="px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <head>
      <title>{{ $t("pages.events.index.title") }} </title>
    </head>
    <headerapppage
      :header="$t('pages.events.index.header')"
      :tagline="$t('pages.events.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <topicmarker topic="my topics dropdown" />
      </div>
    </headerapppage>
    <div class="pt-3 pb-6 space-y-6 md:pt-4">
      <cardsearchresult
        searchResultType="event"
        :isPrivate="false"
        :event="event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { event } from "../../types/event";

definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();

const event: event = {
  name: "test event",
  type: "act",
  tagline: "we love to test!",
  organizer: "testers llc",
  topic: "testing and designing",
  description: "this is a test event for testers.",
  getInvolvedDescription: "wanna help test?",
  inPersonLocation: "berlin",
  // onlineLocation: "zoom test room",
  date: new date(),
  supporters: 10,
};
</script>

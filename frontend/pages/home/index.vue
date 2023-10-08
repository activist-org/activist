<template>
  <div
    class="px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <head>
      <title>{{ $t("pages.home.index.title") }}</title>
    </head>
    <headerapppage
      :header="$t('pages.home.index.header')"
      :tagline="$t('pages.home.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <topicmarker topic="my topics dropdown" />
      </div>
    </headerapppage>
    <div class="pt-3 pb-6 space-y-6 md:pt-4">
      <gridhomemetrics />
      <cardsearchresult
        searchResultType="event"
        :isPrivate="false"
        :event="event"
      />
      <cardsearchresult
        searchResultType="organization"
        :isPrivate="false"
        :organization="organization"
      />
      <cardsearchresult
        searchResultType="resource"
        :isPrivate="false"
        :resource="resource"
      />
      <cardsearchresult
        searchResultType="user"
        :isPrivate="false"
        :user="user"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { event } from "../../types/event";
import { organization } from "../../types/organization";
import { resource } from "../../types/resource";
import { user } from "../../types/user";

const { data: organizations } = await useFetch(
  "http://127.0.0.1:8000/organizations"
);

console.log(organizations);

definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();

const resource: resource = {
  name: "test resource",
  organizer: "testers llc",
  resourceURL: "www.test.com",
  description: "test resource :d",
  topic: "tools",
  relatedLocation: "berlin",
  creationDate: new date(),
  stars: 5,
};

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

const user: user = {
  name: "john a. tester",
  location: "testerville, tn",
  supporters: 123,
  description: "i love to test!",
};
</script>

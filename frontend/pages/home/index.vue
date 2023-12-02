<template>
  <div
    class="px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("_global.home") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.home.index.header')"
      :tagline="$t('pages.home.index.subheader')"
    >
      <ComboboxTopics
        :topic="$t('pages.home.index.dropdown-topics')"
        :hasIcon="true"
        :items="topicItems"
        iconName="bi:globe"
        :isRounded="true"
      />
    </HeaderAppPage>
    <div class="pt-3 pb-6 space-y-6 md:pt-4">
      <div
        class="flex flex-col lg:grid space-y-6 lg:grid-cols-7 lg:grid-rows-1 lg:space-y-0 lg:space-x-6 lg:mr-6"
      >
        <CardMetricsOverview class="lg:col-span-5" />
        <MediaCalendar class="w-full h-full lg:col-span-2" />
      </div>
      <CardSearchResult
        searchResultType="event"
        :isPrivate="false"
        :event="event"
      />
      <CardSearchResult
        searchResultType="organization"
        :isPrivate="false"
        :organization="organization"
      />
      <CardSearchResult
        searchResultType="resource"
        :isPrivate="false"
        :resource="resource"
      />
      <CardSearchResult
        searchResultType="user"
        :isPrivate="false"
        :user="user"
      />
      <CardChangeAccountInfoUsername />
      <CardChangeAccountInfoPassword />
      <CardChangeAccountInfoEmail />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Event } from "~/types/event";
import { Organization } from "~/types/organization";
import { Resource } from "~/types/resource";
import { User } from "~/types/user";

const { data: organizations } = await useFetch(
  "http://127.0.0.1:8000/organizations"
);

console.log(organizations);

definePageMeta({
  layout: "sidebar",
});

const topicItems = ["Topic 1", "Topic 2", "Topic 3", "Topic 4"];

const resource: Resource = {
  name: "Test Resource",
  organization: "Testers LLC",
  resourceURL: "www.test.com",
  description: "Test resource :D",
  topic: "Tools",
  relatedLocation: "Berlin",
  creationDate: new Date(),
  stars: 5,
};

const organization: Organization = {
  name: "tech from below",
  status: "approved",
  tagline: "Technologie von und für soziale Bewegungen",
  location: "Berlin",
  description: "This is the description of tech from below.",
  topic: "Technology and Privacy",
  members: 3,
  supporters: 30,
  imageURL: "/images/tech-from-below.svg",
};

const event: Event = {
  name: "Test Event",
  type: "action",
  tagline: "We love to test!",
  organizations: ["Testers LLC"],
  topic: "Testing and Designing",
  description: "This is a test event for testers.",
  getInvolvedDescription: "Wanna help test?",
  inPersonLocation: "Berlin",
  // onlineLocation: "Zoom Test Room",
  date: new Date(),
  supporters: 10,
};

const user: User = {
  name: "John A. Tester",
  location: "Testerville, TN",
  supporters: 123,
  description: "I love to test!",
};
</script>

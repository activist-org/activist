<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0 px-4 xl:px-8"
  >
    <Head>
      <Title>{{ $t("_global.home") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.home.index.header')"
      :tagline="$t('pages.home.index.subheader')"
    >
      <ComboboxTopics class="pb-3 lg:pb-4" />
    </HeaderAppPage>
    <div class="space-y-6 pb-6">
      <div
        class="flex flex-col space-y-6 lg:mr-6 lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:space-x-6 lg:space-y-0"
      >
        <CardMetricsOverview
          class="lg:col-span-5"
          :metrics="{
            'total events': 123,
            'action events': 100,
            'learn events': 23,
            'new orgs': 10,
          }"
        />
        <MediaCalendar class="h-full w-full lg:col-span-2" />
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
import type { Event } from "~/types/event";
import type { Organization } from "~/types/organization";
import type { Resource } from "~/types/resource";
import type { User } from "~/types/user";

const { data: organizations } = await useFetch(
  "http://127.0.0.1:8000/organizations"
);

console.log(organizations);

definePageMeta({
  layout: "sidebar",
});

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

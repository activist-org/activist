<template>
  <div
    class="px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.home.index.title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.home.index.header')"
      :tagline="$t('pages.home.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <TopicMarker topic="My topics dropdown" />
      </div>
    </HeaderAppPage>
    <div class="pt-3 pb-6 space-y-6 md:pt-4">
      <div
        class="flex flex-col lg:grid space-y-6 lg:grid-cols-7 lg:grid-rows-1 lg:space-y-0 lg:space-x-6 lg:mr-6"
      >
        <GridHomeMetrics class="lg:col-span-5" />
        <MediaDatePicker class="w-full h-full lg:col-span-2" />
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

      <CardSearchResult
        searchResultType="discussionInput"
        :isPrivate="false"
        :discussionInput="discussionInput"
      /> 

      <CardDiscussionEntry :isPrivate="false" :discussion="discussion" />

    </div>
  </div>
</template>

<script setup lang="ts">
import { Discussion } from "../../types/discussion";
import { Event } from "../../types/event";
import { Organization } from "../../types/organization";
import { Resource } from "../../types/resource";
import { User } from "../../types/user";
import { DiscussionInput } from "~/types/discussionInput";

const { data: organizations } = await useFetch(
  "http://127.0.0.1:8000/organizations"
);

console.log(organizations);

definePageMeta({
  layout: "sidebar",
});

const resource: Resource = {
  name: "Test Resource",
  organizer: "Testers LLC",
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

const user: User = {
  name: "John A. Tester",
  location: "Testerville, TN",
  supporters: 123,
  description: "I love to test!",
};


const discussionInput: DiscussionInput = {
  name: "Text ",
  location: "Testerville, TN",
  supporters: 123,
  description: "I love to test!",
  category: "Category",
  write: "Write",
  preview: "Preview",

const discussion: Discussion = {
  title: "Title of discussion ",
  author: "John A. Tester",
  category: "Category",
  text: "I love to test!",
  upVoters: 123,
  participants: 3,
  messages: 3,
  creationDate: new Date(),

};
</script>

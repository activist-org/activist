<template>
  <div
    class="flex flex-col px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{
          $t("_global.discussions_lower")
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="organization.name + ' ' + $t('_global.discussions_lower')"
      :tagline="$t('pages.organizations.discussions.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnLabeled
          class="hidden md:block w-max"
          :cta="true"
          linkTo="/"
          label="components.btn-labeled.new-discussion"
          fontSize="sm"
          leftIcon="bi:plus-lg"
          iconSize="1.35em"
          ariaLabel="components.btn-labeled.new-discussion-aria-label"
        />
        <BtnLabeled
          class="hidden md:block w-max"
          :cta="true"
          linkTo="/"
          label="components.btn-labeled.share-discussion"
          fontSize="sm"
          leftIcon="bi:box-arrow-up"
          iconSize="1.25em"
          ariaLabel="components.btn-labeled.share-discussion-aria-label"
        />
      </div>
    </HeaderAppPage>
    <div class="pt-3 pb-6 space-y-6 md:pt-4">
      <CardDiscussionEntry :isPrivate="false" :discussion="discussion" />
      <CardDiscussionEntry :isPrivate="false" :discussion="discussion" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DiscussionEntry } from "~/types/card-discussion-entry";
import { Organization } from "~/types/organization";

definePageMeta({
  layout: "sidebar",
});

const organization: Organization = {
  name: "tech from below",
  status: "approved",
  tagline: "Technologie von und für soziale Bewegungen",
  location: "Berlin, Germany",
  description:
    "Nulla aliqua sit fugiat commodo excepteur deserunt dolor ullamco Lorem. Esse aliquip nisi ullamco pariatur velit officia. Eiusmod commodo nulla consequat minim laboris pariatur adipisicing. Veniam amet nostrud id cupidatat. Esse duis velit elit duis non labore adipisicing sunt eu nostrud. Occaecat mollit et do consectetur fugiat amet.",
  topic: "Technology and Privacy",
  members: 3,
  supporters: 60,
  imageURL: "/images/tech-from-below.svg",
  workingGroups: ["meetup", "code-night"],
  socialLinks: ["tfb@mastodon", "tfb@email"],
  donationPrompt: "Hey thanks!",
};

const discussion: DiscussionEntry = {
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

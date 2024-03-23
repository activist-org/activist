<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0 flex flex-col px-4 xl:px-8"
  >
    <Head>
      <Title>{{ organization.name }}</Title>
    </Head>
    <HeaderAppPage :organization="organization">
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnAction
          class="w-max"
          :cta="true"
          label="components.btn-action.support"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.25em"
          :counter="organization.supporters"
          ariaLabel="
            components.btn-action.support-organization-aria-label
          "
        />
        <ModalSharePage
          :cta="true"
          label="components.btn-action.share-organization"
          ariaLabel="components.btn-action.share-organization-aria-label"
          :organization="organization"
        />
      </div>
    </HeaderAppPage>
    <div class="space-y-6 pb-6">
      <CardOrgApplicationVote
        v-if="organization.status === 'pending'"
        @up-vote="upVotes++"
        @down-vote="downVotes++"
        title="Votes in favor"
        :organizations="organizationsInFavor"
        :upVotes="upVotes"
        :downVotes="downVotes"
      />
      <div
        class="grid grid-cols-1 grid-rows-2 space-y-6 pb-6 lg:grid-cols-3 lg:grid-rows-1 lg:space-y-0 lg:pb-0"
        :class="{
          'lg:mr-6 lg:space-x-6': !textExpanded,
        }"
      >
        <CardAbout
          @expand-reduce-text="expandReduceText"
          :class="{
            'lg:col-span-2': !textExpanded,
            'lg:col-span-3': textExpanded,
          }"
          aboutType="organization"
          :organization="organization"
        />
        <div class=""h-full w-full relative">
          <ModalUploadImage>
            <template #normalDisplay>
              <button
                class="absolute right-2 bottom-2 z-10 text-white/85 border-white border-opacity-80 bg-black bg-opacity-80 border-solid border rounded-lg"
              >
                <Icon
                  class="w-10 h-10 "
                  name="bi:plus-lg"
                />
              </button>
            </template>
          </ModalUploadImage>
          <MediaImageCarousel :class="{ 'lg:hidden': textExpanded }" />
        </div>
      </div>
      <CardGetInvolved
        v-if="organization.status === 'approved'"
        :organization="organization"
      />
      <CardConnect
        :socialLinks="organization.socialLinks"
        :userIsAdmin="true"
      />
      <CardDonate
        v-if="organization.status === 'approved'"
        :userIsAdmin="true"
        :donationPrompt="organization.donationPrompt"
      />
      <div v-if="organization.status === 'pending'" class="space-y-6">
        <Discussion
          :discussionInput="testDiscussionInput"
          :discussionTexts="testDiscussionTexts"
          :organization="organization"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import type { DiscussionInput } from "~/types/card-discussion-input";
import type { DiscussionText } from "~/types/card-discussion-text";
import type { Organization } from "~/types/organization";

definePageMeta({
  layout: "sidebar",
});

const textExpanded = ref(false);
const expandReduceText = () => {
  textExpanded.value = !textExpanded.value;
};

const route = useRoute();

// TODO: for testing purpose, should be removed.
const upVotes = ref(123);
const downVotes = ref(123);

const testDiscussionTexts: DiscussionText[] = [
  {
    // authorImg?: "string",
    author: "Name",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat bibendum libero in condimentum. Pellentesque euismod consequat mi ac mollis. In viverra, orci a consequat varius, nisi sem dictum ex, id fermentum purus quam non risus. Curabitur sit amet sem mollis, iaculis felis eu, viverra urna. Praesent purus risus, faucibus molestie mi sit amet, congue tristique sem.",
    votes: 123,
    date: new Date(Date.now()),
  },
  {
    // authorImg?: "string",
    author: "Name",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat bibendum libero in condimentum. Pellentesque euismod consequat mi ac mollis. In viverra, orci a consequat varius, nisi sem dictum ex, id fermentum purus quam non risus. Curabitur sit amet sem mollis, iaculis felis eu, viverra urna. Praesent purus risus, faucibus molestie mi sit amet, congue tristique sem.",
    votes: 123,
    date: new Date(Date.now()),
  },
];

const testDiscussionInput: DiscussionInput = {
  name: "Name",
  // location?: string,
  supporters: 1,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat bibendum libero in condimentum. Pellentesque euismod consequat mi ac mollis. In viverra, orci a consequat varius, nisi sem dictum ex, id fermentum purus quam non risus. Curabitur sit amet sem mollis, iaculis felis eu, viverra urna. Praesent purus risus, faucibus molestie mi sit amet, congue tristique sem.",
  category: "Category 1",
  highRisk: false,
};

const testOrganization: Organization = {
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

const organization = reactive<Organization>({ ...testOrganization });
const organizationsInFavor = new Array(6)
  .fill(undefined)
  .map(() => testOrganization);

onMounted(() => {
  const status = route.query.status?.toString();

  if (status !== undefined) {
    organization.status = status;
  }
});

provide("modalOrganizationStatusData", {
  discussionTexts: testDiscussionTexts,
  organizationsInFavor: organizationsInFavor,
  upVotes: 6,
  downVotes: 4,
});
</script>

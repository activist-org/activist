<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
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
          iconSize="1.45em"
          :counter="organization.supporters"
          ariaLabel="
            components.btn-action.support-organization-aria-label
          "
        />
        <ModalSharePage
          :cta="true"
          label="components._global.share-organization"
          :organization="organization"
          ariaLabel="components._global.share-organization-aria-label"
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
        class="lg:grid lg:grid-cols-3 lg:grid-rows-1"
        :class="{
          'lg:mr-6 lg:space-x-6': !textExpanded,
        }"
      >
        <CardAbout
          @expand-reduce-text="expandReduceText"
          class="mb-6 lg:mb-0"
          :class="{
            'lg:col-span-2': !textExpanded,
            'lg:col-span-3': textExpanded,
          }"
          aboutType="organization"
          :organization="organization"
        />
        <div class="h-full w-full">
          <ModalMediaImageCarousel :class="{ 'lg:hidden': textExpanded }" />
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
          :discussionTexts="discussionEntries"
          :organization="organization"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiscussionEntry } from "~/types/card-discussion-entry";
import type { DiscussionInput } from "~/types/card-discussion-input";
import type { Organization } from "~/types/organization";

definePageMeta({
  layout: "sidebar",
});

const route = useRoute();

const textExpanded = ref(false);
const expandReduceText = () => {
  textExpanded.value = !textExpanded.value;
};

// TODO: for testing purpose, should be removed.
const upVotes = ref(123);
const downVotes = ref(123);

const discussionEntries: DiscussionEntry[] = [
  {
    // authorImg?: "string",
    id: 1,
    author: "Name",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat bibendum libero in condimentum. Pellentesque euismod consequat mi ac mollis. In viverra, orci a consequat varius, nisi sem dictum ex, id fermentum purus quam non risus. Curabitur sit amet sem mollis, iaculis felis eu, viverra urna. Praesent purus risus, faucibus molestie mi sit amet, congue tristique sem.",
    votes: 123,
    date: new Date(Date.now()),
  },
  {
    // authorImg?: "string",
    id: 1,
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
  workingGroups: ["Core", "Meetup", "Code Night", "Organizing"],
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
  discussionEntries: discussionEntries,
  organizationsInFavor: organizationsInFavor,
  upVotes: 6,
  downVotes: 4,
});
</script>

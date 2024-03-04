<template>
  <div
    class="flex flex-col px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ organization.name }}</Title>
    </Head>
    <HeaderAppPage :organization="organization">
      <div class="flex space-x-2 lg:space-x-3 pb-3 lg:pb-4">
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
    <div class="pb-6 space-y-6">
      <div
        class="pb-6 grid grid-cols-1 grid-rows-2 space-y-6 lg:grid-cols-3 lg:grid-rows-1 lg:pb-0 lg:space-y-0"
        :class="{
          'lg:space-x-6 lg:mr-6': !textExpanded,
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
        <div class="w-full h-full">
          <MediaImageCarousel :class="{ 'lg:hidden': textExpanded }" />
        </div>
      </div>
      <CardOrgApplicationVote
        v-if="organization.status === 'pending'"
        @up-vote="upVotes++"
        @down-vote="downVotes++"
        title="Votes in favor"
        :organizations="organizationsInFavor"
        :up-votes="upVotes"
        :down-votes="downVotes"
      />
      <CardGetInvolved :organization="organization" />
      <CardConnect
        :social-links="organization.socialLinks"
        :userIsAdmin="true"
      />

      <CardDonate
        :userIsAdmin="true"
        :donationPrompt="organization.donationPrompt"
      />

      <!-- <CardDiscussionEntry :is-private="false" :discussion="discussion" /> -->

      <h3 class="text-left responsive-h3 font-display">
        {{ $t("_global.discussion") }}
      </h3>
      <hr />

      <CardDiscussionText
        :is-private="false"
        :discussion-texts="testDiscussionTexts"
      />
      <CardDiscussionInput :discussion-input="testDiscussionInput" />
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
</script>

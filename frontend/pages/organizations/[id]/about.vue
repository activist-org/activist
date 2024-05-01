<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ organization.name }}</Title>
    </Head>
    <HeaderAppPage :organization="organization">
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnRouteExternal
          v-if="organization.getInvolvedURL"
          class="w-max"
          :cta="true"
          :linkTo="organization.getInvolvedURL"
          label="components.btn-route-internal.join-organization"
          fontSize="sm"
          rightIcon="bi:arrow-right"
          iconSize="1.45em"
          ariaLabel="components.btn-route-internal.join-organization-aria-label"
        />
        <!-- <BtnAction
          class="w-max"
          :cta="true"
          label="components.btn-action.support"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.45em"
          :counter="organization.supporters.length"
          ariaLabel="
            components.btn-action.support-organization-aria-label
          "
        /> -->
        <BtnAction
          @click="openModal()"
          @keydown.enter="openModal()"
          class="w-max"
          :cta="true"
          :label="$t(shareButtonLabel)"
          :hideLabelOnMobile="false"
          fontSize="sm"
          leftIcon="bi:box-arrow-up"
          iconSize="1.45em"
          :ariaLabel="$t('components._global.share-organization-aria-label')"
        />
        <ModalSharePage
          @closeModal="handleCloseModal"
          :cta="true"
          :organization="organization"
          :isOpen="modalIsOpen"
        />
      </div>
    </HeaderAppPage>
    <div class="space-y-6 pb-6">
      <!-- organization.status === 1 means it's application is pending. -->
      <!-- <CardOrgApplicationVote
        v-if="organization.status === 1"
        @up-vote="upVotes++"
        @down-vote="downVotes++"
        title="Votes in favor"
        :organizations="organizationsInFavor"
        :upVotes="upVotes"
        :downVotes="downVotes"
      /> -->
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
          <MediaImageCarouselFull :class="{ 'lg:hidden': textExpanded }" />
        </div>
      </div>
      <!-- organization.status === 2 means it's active. -->
      <CardGetInvolved
        v-if="organization.status === 2"
        :organization="organization"
      />
      <CardConnect
        :socialLinks="organization.socialLinks"
        :userIsAdmin="true"
      />
      <!-- <CardDonate
        v-if="organization.status === 2"
        :userIsAdmin="true"
        :donationPrompt="organization.donationPrompt"
      /> -->
      <div v-if="organization.status === 1" class="space-y-6">
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
import { Breakpoint } from "~/types/breakpoints";
import type { DiscussionEntry } from "~/types/discussion-entry";
import type { DiscussionInput } from "~/types/discussion-input";
import { testTechOrg } from "~/utils/testEntities";

definePageMeta({
  layout: "sidebar",
});

const organization = testTechOrg;
// const route = useRoute();

const textExpanded = ref(false);
const expandReduceText = () => {
  textExpanded.value = !textExpanded.value;
};

const windowWidth = ref(window.innerWidth);
const shareButtonLabel = ref("");

function updateShareBtnLabel() {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value < Breakpoint.SMALL) {
    shareButtonLabel.value = "components.btn-action.share";
  } else {
    shareButtonLabel.value = "components._global.share-organization";
  }
}

onMounted(() => {
  window.addEventListener("resize", updateShareBtnLabel);
  updateShareBtnLabel();
});

onUpdated(() => {
  updateShareBtnLabel();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateShareBtnLabel);
});

// TODO: for testing purpose, should be removed.
// const upVotes = ref(123);
// const downVotes = ref(123);

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

// const organization = reactive<Organization>({ ...organization });
// const organizationsInFavor = new Array(6)
//   .fill(undefined)
//   .map(() => organization);

// onMounted(() => {
//   const status = parseInt(route.query.status.toString());

//   if (status !== undefined) {
//     organization.status = status;
//   }
// });

// provide("modalOrganizationStatusData", {
//   discussionEntries: discussionEntries,
//   organizationsInFavor: organizationsInFavor,
//   upVotes: 6,
//   downVotes: 4,
// });

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>

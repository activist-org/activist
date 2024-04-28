<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ event.name }}&nbsp;{{ $t("_global.discussions_lower") }}</Title>
    </Head>
    <HeaderAppPage
      :event="event"
      :header="event.name + ' ' + $t('_global.discussion_lower')"
      :tagline="$t('pages.events.discussion.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          @click="openModal()"
          @keydown.enter="openModal()"
          class="w-max"
          :cta="true"
          :label="$t('components._global.share-event')"
          :hideLabelOnMobile="true"
          fontSize="sm"
          leftIcon="bi:box-arrow-up"
          iconSize="1.45em"
          :ariaLabel="$t('components._global.share-event-aria-label')"
        />
        <ModalSharePage
          @closeModal="handleCloseModal"
          :cta="true"
          :event="event"
          :isOpen="modalIsOpen"
        />
      </div>
    </HeaderAppPage>
    <div class="space-y-6 pb-6 pt-3 md:pt-4">
      <Discussion
        :discussionInput="discussionInput"
        :discussionEntries="[discussionEntry, discussionEntry]"
        :organizations="event.organizations"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiscussionEntry } from "~/types/card-discussion-entry";
import type { DiscussionInput } from "~/types/card-discussion-input";
import type { Event } from "~/types/event";
import type { Organization } from "~/types/organization";

definePageMeta({
  layout: "sidebar",
});

const organization: Organization = {
  name: "Berlin Climate Org",
  status: "approved",
  tagline: "Fighting Climate Change",
  location: "Berlin, Germany",
  description:
    "Nulla aliqua sit fugiat commodo excepteur deserunt dolor ullamco Lorem. Esse aliquip nisi ullamco pariatur velit officia. Eiusmod commodo nulla consequat minim laboris pariatur adipisicing. Veniam amet nostrud id cupidatat. Esse duis velit elit duis non labore adipisicing sunt eu nostrud. Occaecat mollit et do consectetur fugiat amet.",
  topic: "Environment",
  members: 3,
  supporters: 60,
  workingGroups: ["Fundraising", "Campaigning"],
  socialLinks: ["climate-org@mastodon", "climate-org@email"],
  donationPrompt: "Hey thanks!",
};

const event: Event = {
  name: "Brandenburg Gate Climate Demo",
  tagline: "There is no Planet B",
  organizations: [organization],
  type: "action",
  topic: "Environment",
  description:
    "Aute aliqua reprehenderit ex ut commodo nostrud et excepteur. Sunt amet velit sunt fugiat et excepteur dolore pariatur nisi non. Exercitation aute aute culpa commodo commodo ea Lorem aliquip id duis. Laboris nostrud ullamco ea voluptate et anim id adipisicing sint reprehenderit incididunt elit. Est fugiat pariatur elit culpa in incididunt eu esse cupidatat minim. Deserunt duis culpa minim Lorem consectetur quis fugiat ipsum nostrud voluptate veniam do. Reprehenderit duis officia in enim anim elit.",
  getInvolvedDescription:
    "Sint cillum excepteur sint cupidatat do consectetur excepteur nisi veniam. Sint id in sit eiusmod Lorem commodo minim culpa id cupidatat consectetur. Labore nisi est officia sunt occaecat.",
  inPersonLocation: "Brandenburg Gate, Berlin",
  date: new Date().toISOString().slice(0, 10),
  supporters: 30,
  imageURL: "/images/tech-from-below.svg",
  socialLinks: ["climate_org@mastodon", "climate_org@email.com"],
};

const discussionEntry: DiscussionEntry = {
  id: 1,
  author: "John A. Tester",
  content:
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
  votes: 123,
  date: new Date(),
};

const discussionInput: DiscussionInput = {
  name: "Text ",
  location: "Testerville, TN",
  supporters: 123,
  description: "I love to test!",
  category: "Category",
  highRisk: false,
};

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>

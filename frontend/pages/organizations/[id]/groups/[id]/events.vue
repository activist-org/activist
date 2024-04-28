<template>
  <MenuSubPageSelector
    class="pt-2 md:pt-0"
    :selectors="groupSubPages"
    :selectedRoute="1"
  />
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ group.name }}&nbsp;{{ $t("_global.events_lower") }}</Title>
    </Head>
    <HeaderAppPage
      :group="group"
      :header="group.name + ' ' + $t('_global.events_lower')"
      :tagline="$t('pages.organizations.events.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnAction
          class="w-max"
          :cta="true"
          label="components.btn-action.support"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.45em"
          :counter="group.supporters"
          ariaLabel="
            components.btn-action.support-group-aria-label
          "
        />
        <BtnAction
          @click="openModal()"
          @keydown.enter="openModal()"
          class="w-max"
          :cta="true"
          :label="$t('components._global.share-group')"
          :hideLabelOnMobile="true"
          fontSize="sm"
          leftIcon="bi:box-arrow-up"
          iconSize="1.45em"
          :ariaLabel="$t('components._global.share-group-aria-label')"
        />
        <ModalSharePage
          @closeModal="handleCloseModal"
          :cta="true"
          :group="group"
          :isOpen="modalIsOpen"
        />
      </div>
    </HeaderAppPage>
    <div class="space-y-3 py-4">
      <CardSearchResult
        searchResultType="event"
        :reduced="true"
        :event="event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/event";
import type { Group } from "~/types/group";
import { getGroupSubPages } from "~/utils/groupSubPages";

definePageMeta({
  layout: "sidebar",
});

const groupSubPages = getGroupSubPages();

const testGroup: Group = {
  name: "Code Night",
  organization: "tech from below",
  tagline: "Let's code!",
  location: "Berlin, Germany",
  description:
    "Nulla aliqua sit fugiat commodo excepteur deserunt dolor ullamco Lorem. Esse aliquip nisi ullamco pariatur velit officia. Eiusmod commodo nulla consequat minim laboris pariatur adipisicing. Veniam amet nostrud id cupidatat. Esse duis velit elit duis non labore adipisicing sunt eu nostrud. Occaecat mollit et do consectetur fugiat amet.",
  topic: "Technology and Privacy",
  members: 3,
  supporters: 60,
  imageURL: "/images/tech-from-below.svg",
  socialLinks: ["tfb@mastodon", "tfb@email"],
  donationPrompt: "Hey thanks!",
};

const group = reactive<Group>({ ...testGroup });

const event: Event = {
  name: "bimonthly tech meetup",
  tagline: "let's fix some bugs!",
  organizations: ["org1", "org2"],
  type: "learn",
  topic: "Hackathon",
  description: "let's fix some bugs!",
  getInvolvedDescription: "squash some bugs!",
  inPersonLocation: "Berlin, Germany",
  supporters: 234,
  date: new Date(),
};

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>

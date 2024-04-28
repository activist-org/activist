<template>
  <MenuSubPageSelector
    class="pt-2 md:pt-0"
    :selectors="groupSubPages"
    :selectedRoute="2"
  />
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ group.name }}&nbsp;{{ $t("_global.resources_lower") }}</Title>
    </Head>
    <HeaderAppPage
      :group="group"
      :header="group.name + ' ' + $t('_global.resources_lower')"
      :tagline="$t('pages.organizations.resources.tagline')"
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
        searchResultType="resource"
        :reduced="true"
        :resource="resource"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Group } from "~/types/group";
import type { Resource } from "~/types/resource";
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

const resource: Resource = {
  name: "Activist website",
  organization: "activist.org",
  resourceURL: "www.activist.org",
  description:
    "Let's build a platform where movements grow and people are inspired to act on the issues that affect us all...",
  topic: "Sites",
  relatedLocation: "Berlin, DE",
  creationDate: new Date(),
  stars: 100000000,
};

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>

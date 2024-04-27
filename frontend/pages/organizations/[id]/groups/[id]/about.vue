<template>
  <MenuSubPageSelector
    class="pt-2 md:pt-0"
    :selectors="groupSubPages"
    :selectedRoute="0"
  />
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ group.name }}</Title>
    </Head>
    <HeaderAppPage :group="group">
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
        <ModalSharePage
          :cta="true"
          label="components._global.share-group"
          :group="group"
          ariaLabel="components._global.share-group-aria-label"
        />
      </div>
    </HeaderAppPage>
    <div class="space-y-6 pb-6">
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
          :group="group"
        />
        <div class="h-full w-full">
          <ModalMediaImageCarousel :class="{ 'lg:hidden': textExpanded }" />
        </div>
      </div>
      <CardGetInvolved :group="group" />
      <CardConnect :socialLinks="group.socialLinks" :userIsAdmin="true" />
      <CardDonate :userIsAdmin="true" :donationPrompt="group.donationPrompt" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Group } from "~/types/group";
import { getGroupSubPages } from "~/utils/groupSubPages";

definePageMeta({
  layout: "sidebar",
});

const groupSubPages = getGroupSubPages();

const textExpanded = ref(false);
const expandReduceText = () => {
  textExpanded.value = !textExpanded.value;
};

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
</script>

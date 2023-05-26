<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1
      class="pt-6 transition-all duration-500 responsive-h1 text-light-text dark:text-dark-text"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      {{ organization.name }}
    </h1>
    <flex class="flex items-center relative py-6"
      ><h2
        class="transition-all duration-500 responsive-h4 text-light-special-text dark:text-dark-special-text"
        :class="{
          'pl-56':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        {{ organization.tagline }}
      </h2>
      <LabeledBtn
        class="absolute right-7"
        :cta="true"
        label="Share organization"
        linkTo="/"
        fontSize="base"
      ></LabeledBtn>
    </flex>
    <div
      class="pr-2 space-y-2 sm:pr-8"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <CardsAbout
        description="We're a Berlin based social tech meetup..."
        aboutType="organization"
      ></CardsAbout>
      <MediaImageCarousel></MediaImageCarousel>
      <CardsGetInvolved :organization="organization"></CardsGetInvolved>
      <CardsConnect
        :socialLinks="[
          'tfb@twitter',
          'tfb@email',
          'tfb@facebook',
          'tfb@instagram',
        ]"
        :userIsAdmin="true"
      ></CardsConnect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Organization } from "~~/types/organization";

const organization: Organization = {
  name: "tech from below",
  tagline: "Technologie von und für soziale Bewegungen",
  location: "Berlin",
  description: "This is the description of tech from below",
  topic: "Technology and Privacy",
  members: 3,
  supporters: 30,
  imageURL: "/images/tech-from-below.svg",
  workingGroupURLs: [
    "activist.org/organizations/tech-from-below/groups/meetup",
    "activist.org/organizations/tech-from-below/groups/code-night",
  ],
};

definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();

const title = ref(organization.name);

// export default defineComponent({
//   data() {
//     return {
//       organization,
//     };
//   },
// });
</script>

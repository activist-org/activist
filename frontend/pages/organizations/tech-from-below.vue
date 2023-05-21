<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1
      class="p-4 pl-56 transition-all duration-500 responsive-text-4 text-light-text dark:text-dark-text"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      tech from below
    </h1>
    <div
      class="pr-2 space-y-2 sm:pr-8"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <CardsAbout
        name="tech from below"
        description="We're a Berlin based social tech meetup..."
        aboutType="organization"
      ></CardsAbout>
      <CardsSearchResult
        name="tech from below"
        description="Description of the search result"
        searchResultType="organization"
        :private="false"
        :organization="organization"
      ></CardsSearchResult>
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
  <div class="w-2/5 float-right m-10">
  <Carousel></Carousel>
</div>
</template>

<script setup lang="ts">
import { Organization } from "~~/types/organization";

const title = ref("Home");
definePageMeta({
  layout: "sidebar",
});

const sidebar = useSidebar();
</script>

<script lang="ts">
const organization: Organization = {
  name: "tech from below",
  location: "Berlin",
  description: "This is the description of tech from below",
  topic: "Technology and Privacy",
  members: 3,
  supporters: 30,
  imageURL: "/images/tech-from-below.svg",
};

export default defineComponent({
  data() {
    return {
      organization,
    };
  },
});
</script>

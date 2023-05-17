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
        name="Search result"
        description="Description of the search result"
        searchResultType="organization"
        :private="false"
        mode="organization"
        :organization="organization"
      ></CardsSearchResult>
      <CardsConnect
        twitter="tfb@twitter"
        email="tfb@email"
        facebook="tfb@fb"
        instagram="tfb@instagram"
        :showAddMoreBtn="true"
      ></CardsConnect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Organization } from '~~/types/organization';

const title = ref("Home");
definePageMeta({
  layout: "sidebar",
});

const sidebar = useSidebar();
</script>

<script lang="ts">
const organization: Organization = {
  members: 2,
  supporters: 2,
  description: 'This is the description of tech from below',
  location: 'Berlin',
  topic: 'Tech'
}

export default defineComponent({
  data() {
    return {
      organization
    }
  }
})
</script>

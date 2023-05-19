<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1
      class="p-4 transition-all duration-500 text-light-text dark:text-dark-text"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      This will be a home page
    </h1>
    <div
      class="pr-2 space-y-4 sm:pr-8"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <CardsSearchResult
        name="Search result"
        description="Description of the search result"
        searchResultType="organization"
        :private="false"
      ></CardsSearchResult>
      <CardsFeed
        title="Group Name"
        description="Lorem ipsum dolor sit, amet consectetur adipisicing elit."
        iconName="bi:globe"
      ></CardsFeed>
      <CardsGetInvolved :event="event" :feeds="getInvolvedFeed"/>
      <div class="w-24 h-24">
        <IconEvent eventType="learn"></IconEvent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const title = ref("Home");
const event = {
  description: `Our weekly Wednesday tour will take place at Leopoldplatz in Wedding
          and Kotti in Kreuzberg! We’ll start the day at 14:00 at our main
          building in Wedding for preparing the warm meals, and then at 18:00
          we’ll head to Leo. We’ll be there for an hour and a half and then will
          be at Kotti at 20:00. The final shift is from 21:30 to 23:00 back at
          the main building in Wedding to clean and get ready for the next
          action :)`,
  plans: ["Preparation: 14:00-18:00, Lynarstraße 38, 13353 Berlin","Tour stop 1: 18:30-19:30, Leopoldplatz, Berlin","Tour stop 2: 20:00-21:30, Kottbusser Tor, Berlin","Cleanup: 22:00-23:30, Lynarstraße 38, 13353 Berlin"],
  disclaimer: "",
};
const getInvolvedFeed = [
  {
    title: "Group One",
    description: "Lorem ipsum dolor sit amet, consectetur adip",
  },
  {
    title: "Group Two",
    description: "Lorem ipsum dolor sit amet, consectetur adip",
  },
  {
    title: "Group Three",
    description: "Lorem ipsum dolor sit amet, consectetur adip",
  },
  {
    title: "Group Four",
    description: "Lorem ipsum dolor sit amet, consectetur adip",
  },
];
definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();
</script>

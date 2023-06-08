<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1
      class="pt-6 pl-56 transition-all duration-500 responsive-h1 text-light-text dark:text-dark-text"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      {{ event.name }}
    </h1>
    <flex class="relative flex items-center py-6"
      ><h2
        class="transition-all duration-500 responsive-h4 text-light-special-text dark:text-dark-special-text"
        :class="{
          'pl-56':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        {{ event.tagline }}
      </h2>
      <LabeledBtn
        class="absolute right-7"
        :cta="true"
        label="Share event"
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
        description="Let's gather at Brandenburg Gate..."
        aboutType="event"
      ></CardsAbout>
      <MediaMap
        v-if="event.inPersonLocation"
        :addresses="[event.inPersonLocation]"
        :type="event.topic"
      />
      <CardsGetInvolved :event="event"></CardsGetInvolved>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Event } from "~~/types/event";

const event: Event = {
  name: "Climate Demo at Brandenburg Gate",
  tagline: "There is no Planet B",
  organizer: "",
  topic: "act",
  description: "",
  getInvolvedDescription:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lectus felis, faucibus cursus tincidunt ut, eleifend gravida enim. Integer sed ex nec sem fringilla elementum quis eu diam.",
  inPersonLocation: "Brandenburg Gate, Berlin",
  supporters: 30,
  imageURL: "/images/tech-from-below.svg",
};

const title = ref(event.name);

definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();
</script>

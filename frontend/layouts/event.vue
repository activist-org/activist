<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1
      class="pt-6 font-bold transition-all duration-500 responsive-h1 text-light-text dark:text-dark-text"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      {{ event.name }}
    </h1>
    <flex class="relative flex items-center w-full py-6 m-0"
      ><h2
        :v-if="event.tagline"
        class="p-0 m-0 transition-all duration-500 responsive-h4 text-light-special-text dark:text-dark-special-text"
        :class="{
          'pl-56':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        {{ event.tagline }}
      </h2>
      <div class="absolute flex mb-5 gap-3 right-8">
        <div class="flex items-center gap-1">
          <BtnLabeled
            :cta="true"
            label="Offer to help"
            linkTo="/"
            fontSize="base"
            rightIcon="bi:arrow-right"
          />
        </div>
        <div class="flex items-center gap-1">
          <BtnLabeled
            :cta="true"
            linkTo="/"
            label="Star"
            fontSize="base"
            leftIcon="bi:star"
          />
        </div>
        <div class="flex items-center gap-1">
          <BtnLabeled
            :cta="true"
            linkTo="/"
            label="Share event"
            fontSize="base"
            leftIcon="bi:box-arrow-up"
          />
        </div>
      </div>
    </flex>
    <div
      class="pb-4 pr-2 space-y-4 sm:pr-8"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <div class="flex w-full gap-6">
        <CardAbout
          class="px-6 h-72"
          :description="event.description"
          aboutType="event"
        />
        <div class="w-96">
          <MediaMap
            v-if="event.inPersonLocation"
            :addresses="[event.inPersonLocation]"
            :type="event.topic"
            :title="event.name"
          />
        </div>
      </div>
      <CardGetInvolved
        event="event"
        :description="event.getInvolvedDescription"
      />
      <CardConnect :social-links="event.socialLinks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~~/types/event";
const title = ref("Home");

defineProps<{
  event: Event;
}>();

definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();

const event: Event = {
  name: "Brandenburg Gate Climate Demo",
  tagline: "There is no Planet B",
  organizer: "",
  topic: "act",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lectus felis, faucibus cursus tincidunt ut, eleifend gravida enim. Integer sed ex nec sem fringilla elementum quis eu diam.",
  getInvolvedDescription:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lectus felis, faucibus cursus tincidunt ut, eleifend gravida enim. Integer sed ex nec sem fringilla elementum quis eu diam.",
  inPersonLocation: "Brandenburg Gate, Berlin",
  date: new Date(),
  supporters: 30,
  imageURL: "/images/tech-from-below.svg",
  socialLinks: [
    "twitter@B_Obdachlosenhi",
    "kontakt@berliner-obdachlosenhilfe.de",
  ],
};
</script>

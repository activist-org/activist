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
      <BtnLabeled
        :cta="true"
        linkTo="/"
        label="Share event"
        fontSize="base"
        leftIcon="bi:box-arrow-up"
        class="absolute right-7"
      />
    </flex>
    <div
      class="pb-4 pr-2 space-y-4 sm:pr-8"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <CardAbout
        description="Let's gather at Brandenburg Gate..."
        aboutType="event"
      />
      <CardAbout
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis purus pulvinar, suscipit velit sit amet, malesuada augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis purus pulvinar, suscipit velit sit amet, malesuada augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis purus pulvinar, suscipit velit sit amet, malesuada augue."
        aboutType="organization"
      />
      <div class="w-72 h-72">
        <MediaMap
          v-if="event.inPersonLocation"
          :addresses="[event.inPersonLocation]"
          :type="event.topic"
          :title="event.name"
        />
      </div>
      <CardGetInvolved :event="event" />
      <CardConnect
        :socialLinks="socialLinks"
        :userIsAdmin="true"
        @on-new-account="(account) => onNewAccount(account)"
        @on-account-removed="(account) => onAccountRemoved(account)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Event } from "~~/types/event";

const event: Event = {
  name: "Brandenburg Gate Climate Demo",
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

const socialLinks = ref([
  "bgcd@twitter",
  "bgcd@email",
  "bgcd@facebook",
  "bgcd@instagram",
]);

const onNewAccount = (account: string) => {
  socialLinks.value.push(account);
};

const onAccountRemoved = (account: string) => {
  socialLinks.value = socialLinks.value.filter((val) => val !== account);
};
</script>

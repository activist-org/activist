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
    <flex class="relative flex items-center py-6"
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
      <BtnLabeled
        :cta="true"
        linkTo="/"
        label="Share organization"
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
        description="We're a Berlin based social tech meetup..."
        aboutType="organization"
      />
      <MediaImageCarousel />
      <CardGetInvolved :organization="organization" />
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

const socialLinks = ref([
  "tfb@twitter",
  "tfb@email",
  "tfb@facebook",
  "tfb@instagram",
]);

const onNewAccount = (account: string) => {
  socialLinks.value.push(account);
};

const onAccountRemoved = (account: string) => {
  socialLinks.value = socialLinks.value.filter((val) => val !== account);
};
</script>

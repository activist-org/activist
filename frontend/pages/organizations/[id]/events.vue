<template>
  <div
    class="flex flex-col px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0"
  >
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{ $t("_global.events_lower") }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="organization.name + ' ' + $t('_global.events_lower')"
      :tagline="$t('pages.organizations.events.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          class="w-max"
          :cta="true"
          linkTo="/"
          label="components._global.new-event"
          fontSize="sm"
          leftIcon="bi:plus-lg"
          iconSize="1.35em"
          ariaLabel="components.btn-route-internal.new-event-aria-label"
        />
      </div>
    </HeaderAppPage>
    <div class="py-4 space-y-3">
      <CardSearchResult
        searchResultType="event"
        :reduced="true"
        :event="event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/event";
import type { Organization } from "~/types/organization";

definePageMeta({
  layout: "sidebar",
});

const organization: Organization = {
  name: "tech from below",
  status: "approved",
  tagline: "Technologie von und für soziale Bewegungen",
  location: "Berlin, Germany",
  description:
    "Nulla aliqua sit fugiat commodo excepteur deserunt dolor ullamco Lorem. Esse aliquip nisi ullamco pariatur velit officia. Eiusmod commodo nulla consequat minim laboris pariatur adipisicing. Veniam amet nostrud id cupidatat. Esse duis velit elit duis non labore adipisicing sunt eu nostrud. Occaecat mollit et do consectetur fugiat amet.",
  topic: "Technology and Privacy",
  members: 3,
  supporters: 60,
  imageURL: "/images/tech-from-below.svg",
  workingGroups: ["meetup", "code-night"],
  socialLinks: ["tfb@mastodon", "tfb@email"],
  donationPrompt: "Hey thanks!",
};

const event: Event = {
  name: "bimonthly tech meetup",
  tagline: "let's fix some bugs!",
  organizations: ["org1", "org2"],
  type: "learn",
  topic: "Hackathon",
  description: "let's fix some bugs!",
  getInvolvedDescription: "squash some bugs!",
  inPersonLocation: "Berlin, Germany",
  supporters: 234,
  date: new Date(),
};
</script>

<template>
  <div
    class="flex flex-col px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <head>
      <title>{{ organization.name }}</title>
    </head>
    <headerapppage :organization="organization">
      <div class="flex space-x-2 lg:space-x-3">
        <btnlabeled
          class="w-max"
          :cta="true"
          linkTo="/"
          label="components.btn-labeled.support"
          fontSize="sm"
          leftIcon="iconsupport"
          iconSize="1.25em"
          :counter="organization.supporters"
          ariaLabel="
            components.btn-labeled.support-organization-aria-label
          "
        />
        <btnlabeled
          class="hidden md:block w-max"
          :cta="true"
          linkTo="/"
          label="components.btn-labeled.share-organization"
          fontSize="sm"
          leftIcon="bi:box-arrow-up"
          iconSize="1.25em"
          ariaLabel="
            components.btn-labeled.share-organization-aria-label
          "
        />
        <btnlabeled
          class="md:hidden w-max"
          :cta="true"
          linkTo="/"
          label="components.btn-labeled.share"
          fontSize="sm"
          leftIcon="bi:box-arrow-up"
          iconSize="1.25em"
          ariaLabel="
            components.btn-labeled.share-organization-aria-label
          "
        />
      </div>
    </headerapppage>
    <div class="pt-3 pb-6 space-y-6 lg:pt-4">
      <div
        class="pb-6 grid grid-cols-1 grid-rows-2 space-y-6 lg:grid-cols-3 lg:grid-rows-1 lg:pb-0 lg:space-y-0 lg:space-x-6 lg:mr-6"
      >
        <cardabout
          class="lg:col-span-2"
          aboutType="organization"
          :organization="organization"
        />
        <div class="w-full h-full">
          <mediaimagecarousel />
        </div>
      </div>
      <cardgetinvolved :organization="organization" />
      <cardconnect
        :social-links="organization.socialLinks"
        :userIsAdmin="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { organization } from "../../../types/organization";

definePageMeta({
  layout: "sidebar",
});

const { id } = useRoute().params;

const organization: organization = {
  name: "tech from below",
  status: "approved",
  tagline: "technologie von und für soziale bewegungen",
  location: "berlin, germany",
  description:
    "nulla aliqua sit fugiat commodo excepteur deserunt dolor ullamco lorem. esse aliquip nisi ullamco pariatur velit officia. eiusmod commodo nulla consequat minim laboris pariatur adipisicing. veniam amet nostrud id cupidatat. esse duis velit elit duis non labore adipisicing sunt eu nostrud. occaecat mollit et do consectetur fugiat amet.",
  topic: "technology and privacy",
  members: 3,
  supporters: 60,
  imageURL: "/images/tech-from-below.svg",
  workingGroups: ["meetup", "code-night"],
  socialLinks: ["tfb@mastodon", "tfb@email"],
};
</script>

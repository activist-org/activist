<template>
  <div
    class="flex flex-col px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ organization.name }}</Title>
    </Head>
    <HeaderAppPage :organization="organization">
      <div class="flex space-x-2 lg:space-x-3">
        <BtnLabeled
          class="w-max"
          :cta="true"
          linkTo="/"
          label="components.btn-labeled.support"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.25em"
          :counter="organization.supporters"
          ariaLabel="
            components.btn-labeled.support-organization-aria-label
          "
        />
        <BtnLabeled
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
        <BtnLabeled
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
    </HeaderAppPage>
    <div class="pt-3 pb-6 space-y-6 lg:pt-4">
      <div
        class="pb-6 grid grid-cols-1 grid-rows-2 space-y-6 lg:grid-cols-3 lg:grid-rows-1 lg:pb-0 lg:space-y-0 lg:space-x-6 lg:mr-6"
      >
        <CardAbout
          class="lg:col-span-2"
          aboutType="organization"
          :organization="organization"
        />
        <div class="w-full h-full">
          <MediaImageCarousel />
        </div>
      </div>
      <CardGetInvolved :organization="organization" />
      <CardConnect
        :social-links="organization.socialLinks"
        :userIsAdmin="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Organization } from "../../../types/organization";

definePageMeta({
  layout: "sidebar",
});

const { id } = useRoute().params;

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
};
</script>

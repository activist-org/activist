<template>
  <div
    class="flex flex-col px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ organization.name }}</Title>
    </Head>
    <HeaderAppPage :organization="organization">
      <BtnLabeled
        :cta="true"
        linkTo="/"
        :label="$t('components.btn-labeled.support')"
        fontSize="base"
        leftIcon="IconSupport"
        iconSize="1.25em"
        :counter="organization.supporters"
      />
      <BtnLabeled
        :cta="true"
        linkTo="/"
        :label="$t('components.btn-labeled.share-organization')"
        fontSize="base"
        leftIcon="bi:box-arrow-up"
        iconSize="1.25em"
      />
    </HeaderAppPage>
    <div class="pb-6 space-y-6">
      <div
        class="grid grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 space-y-6 lg:space-y-0 lg:space-x-6 lg:mr-6"
      >
        <CardAbout
          aboutType="organization"
          :organization="organization"
          class="w-full lg:col-span-2"
        />
        <div class="w-full h-full pb-6 lg:pb-0">
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

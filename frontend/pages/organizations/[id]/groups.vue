<template>
  <div
    class="flex flex-col px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{ $t("_global.groups_lower") }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="organization.name + ' ' + $t('_global.groups_lower')"
      :tagline="$t('pages.organizations.groups.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnLabeled
          class="w-max"
          :cta="true"
          linkTo="/"
          label="components._global.new-group"
          fontSize="sm"
          leftIcon="bi:plus-lg"
          iconSize="1.35em"
          ariaLabel="components.btn-labeled.new-group-aria-label"
        />
      </div>
    </HeaderAppPage>
    <CardSearchResult
      searchResultType="organization"
      :reduced="true"
      :organization="group"
    />
  </div>
</template>

<script setup lang="ts">
import { Organization } from "../../../types/organization";

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

const group: Organization = {
  name: "friends of tech",
  status: "approved",
  tagline: "We're just friends!",
  location: "Kalamazoo, MI",
  description: "Friends!!",
  topic: "test",
  members: 10,
  supporters: 15,
}
</script>

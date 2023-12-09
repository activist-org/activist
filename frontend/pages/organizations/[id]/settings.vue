<template>
  <div
    class="flex flex-col px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{
          $t("_global.affiliates_lower")
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="organization.name + ' ' + $t('_global.affiliates_lower')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnLabeled
          class="w-max"
          :cta="true"
          linkTo="/"
          label="components.btn-labeled.save-settings"
          fontSize="sm"
          ariaLabel="components.btn-labeled.save-settings-aria-label"
        />
      </div>
    </HeaderAppPage>
    <CardDangerZone
      description="Here's where you can delete your account. Please note that this is not a reversible action - any permissions and settings that you have saved will be permanently lost. If you questions on your account please contact us on our contact page."
      ctaBtnText="Permanently delete organization"
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
</script>

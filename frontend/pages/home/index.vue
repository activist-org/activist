<template>
  <div
    class="bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ $t("_global.home") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.home.index.header')"
      :tagline="$t('pages.home.index.subheader')"
    >
      <ComboboxTopics class="pb-3 lg:pb-4" />
    </HeaderAppPage>
    <div class="space-y-6 pb-6">
      <div
        class="flex flex-col space-y-6 lg:mr-6 lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:space-x-6 lg:space-y-0"
      >
        <CardMetricsOverview
          class="lg:col-span-5"
          :metrics="{
            'total events': 123,
            'action events': 100,
            'learn events': 23,
            'new orgs': 10,
          }"
        />
        <MediaCalendar class="h-full w-full lg:col-span-2" />
      </div>
      <CardSearchResultEvent
        :event="testClimateEvent"
        :isReduced="true"
        :isPrivate="false"
      />
      <CardSearchResultOrganization
        :organization="testTechOrg"
        :isReduced="true"
        :isPrivate="false"
      />
      <CardSearchResultGroup
        :group="testTechGroup1"
        :isReduced="true"
        :isPrivate="false"
      />
      <CardSearchResultResource
        :resource="testResource"
        :isReduced="true"
        :isPrivate="false"
      />
      <CardSearchResultUser
        :user="testUser"
        :isReduced="true"
        :isPrivate="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  testClimateEvent,
  testResource,
  testTechGroup1,
  testTechOrg,
  testUser,
} from "~/utils/testEntities";

const { data: organizations } = await useFetch(
  `${BASE_BACKEND_URL}/entities/organizations/`,
  {
    method: "GET",
  }
);

console.log(organizations);
</script>

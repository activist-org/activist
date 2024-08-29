<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{
          $t("pages.organizations._global.events_lower")
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="
        organization.name + ' ' + $t('pages.organizations._global.events_lower')
      "
      :tagline="$t('pages.organizations._global.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          class="w-max"
          :cta="true"
          linkTo="/"
          label="_global.new_event"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="pages.organizations.events.new_event_aria_label"
        />
      </div>
    </HeaderAppPage>
    <PagePreviewEvent />
    <!-- <div v-if="organization.events" class="space-y-3 py-4">
      <CardSearchResultEvent
        v-for="(u, i) in organization.events"
        :key="i"
        :isReduced="true"
        :event="u"
      />
    </div>
    <EmptyState v-else pageType="events" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
import { testTechOrg } from "~/utils/testEntities";

const organization = testTechOrg;
</script>

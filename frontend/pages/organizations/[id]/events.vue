<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
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
    <!-- <div v-if="organization.events" class="space-y-3 py-4">
      <CardSearchResultEvent
        v-for="(u, i) in organization.events"
        :key="i"
        :reduced="true"
        :event="u"
      />
    </div>
    <EmptyState v-else pageType="events" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
import { testTechOrg } from "~/utils/testEntities";

definePageMeta({
  layout: "sidebar",
});

const organization = testTechOrg;
</script>

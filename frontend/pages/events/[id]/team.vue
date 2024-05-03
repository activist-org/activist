<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ event.name }}&nbsp;{{ $t("_global.team_lower") }}</Title>
    </Head>
    <HeaderAppPage
      :event="event"
      :header="event.name + ' ' + $t('_global.team_lower')"
      :tagline="$t('pages.events.team.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          class="w-max"
          :cta="true"
          label="components.btn-action.invite-someone"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="components.btn-action.invite-someone-event-aria-label"
        />
      </div>
    </HeaderAppPage>
    <!-- <div v-if="event.members" class="space-y-3 py-4">
      <CardSearchResultUser
        v-for="(u, i) in event.members"
        :key="i"
        :isReduced="true"
        :user="u"
      />
    </div>
    <EmptyState v-else pageType="users" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
import useRouteToName from "~/composables/useRouteToName";
import { IconMap } from "~/types/icon-map";
import { testClimateEvent } from "~/utils/testEntities";

definePageMeta({
  layout: "sidebar",
});

const emit = defineEmits(["routeToName"]);
useRouteToName(emit);

const event = testClimateEvent;
</script>

<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title
        >{{ event.name }}&nbsp;{{
          $t(i18nMap.pages._global.discussions_lower)
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :event="event"
      :header="
        event.name + ' ' + $t(i18nMap.pages.events.discussion.discussion_lower)
      "
      :tagline="$t(i18nMap.pages.events.discussion.tagline)"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          v-if="aboveMediumBP"
          class="block w-max"
          :cta="true"
          linkTo="/"
          label="pages._global.new_discussion"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="pages._global.new_discussion_aria_label"
        />
      </div>
    </HeaderAppPage>
    <!-- <div v-if="event.discussion" class="space-y-6 pb-6 pt-3 md:pt-4">
      <Discussion
        :discussionInput="event.discussion"
        :discussionEntries="[event.discussion?.entries]"
        :organizations="event.orgs"
      />
    </div>
    <EmptyState v-else pageType="discussions" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";

const aboveMediumBP = useBreakpoint("md");

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(id);

const { event } = eventStore;
</script>

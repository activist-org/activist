<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ event.name }}&nbsp;{{ $t("_global.discussions_lower") }}</Title>
    </Head>
    <HeaderAppPage
      :event="event"
      :header="event.name + ' ' + $t('_global.discussion_lower')"
      :tagline="$t('pages.events.discussion.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          v-if="medium"
          class="block w-max"
          :cta="true"
          linkTo="/"
          label="components.btn-route-internal.new-discussion"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="components.btn-route-internal.new-discussion-aria-label"
        />
      </div>
    </HeaderAppPage>
    <PagePreviewDiscussion />
    <!-- <div v-if="event.discussion" class="space-y-6 pb-6 pt-3 md:pt-4">
      <Discussion
        :discussionInput="event.discussion"
        :discussionEntries="[event.discussion?.entries]"
        :organizations="event.organizations"
      />
    </div>
    <EmptyState v-else pageType="discussions" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
import { testClimateEvent } from "~/utils/testEntities";
import useBreakpoint from "~/composables/useBreakpoint";

const medium = useBreakpoint("md");

const event = testClimateEvent;
</script>

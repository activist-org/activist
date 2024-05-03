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
          class="hidden w-max md:block"
          :cta="true"
          linkTo="/"
          label="components.btn-route-internal.new-discussion"
          fontSize="sm"
          leftIcon="bi:plus-lg"
          iconSize="1.35em"
          ariaLabel="components.btn-route-internal.new-discussion-aria-label"
        />
      </div>
    </HeaderAppPage>
    <div class="space-y-6 pb-6 pt-3 md:pt-4">
      <Discussion
        :discussionInput="discussionInput"
        :discussionEntries="[discussionEntry, discussionEntry]"
        :organizations="event.organizations"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiscussionEntry } from "~/types/discussion-entry";
import type { DiscussionInput } from "~/types/discussion-input";
import { testClimateEvent } from "~/utils/testEntities";
import useRouteToName from "~/composables/useRouteToName";

definePageMeta({
  layout: "sidebar",
});

const emit = defineEmits(["routeToName"]);
useRouteToName(emit);

const event = testClimateEvent;

const discussionEntry: DiscussionEntry = {
  id: 1,
  author: "John A. Tester",
  content:
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
  votes: 123,
  date: new Date(),
};

const discussionInput: DiscussionInput = {
  name: "Text ",
  location: "Testerville, TN",
  supporters: 123,
  description: "I love to test!",
  category: "Category",
  highRisk: false,
};
</script>

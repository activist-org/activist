<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title
        >{{ event.name }}&nbsp;{{
          $t("pages._global.discussions_lower")
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :event="event"
      :header="
        event.name + ' ' + $t('pages.events.discussion.discussion_lower')
      "
      :tagline="$t('pages.events.discussion.tagline')"
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
import useBreakpoint from "~/composables/useBreakpoint";
import { IconMap } from "~/types/icon-map";

const aboveMediumBP = useBreakpoint("md");

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const eventStore = useEventStore();
await eventStore.fetchByID(id);

const { event } = eventStore;
</script>

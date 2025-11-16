<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ event.name }}&nbsp;{{ $t("i18n.pages._global.discussions_lower") }}
      </Title>
    </Head>
    <HeaderAppPageEvent
      :header="
        event.name + ' ' + $t('i18n.pages.events.discussion.discussion_lower')
      "
      :tagline="$t('i18n.pages.events.discussion.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          v-if="aboveMediumBP"
          ariaLabel="i18n.pages._global.new_discussion_aria_label"
          class="block w-max"
          :cta="true"
          fontSize="sm"
          iconSize="1.35em"
          label="i18n.pages._global.new_discussion"
          :leftIcon="IconMap.PLUS"
          linkTo="/"
        />
      </div>
    </HeaderAppPageEvent>
    <!-- <div v-if="event.discussion" class="space-y-6 pb-6 pt-3 md:pt-4">
      <Discussion
        :discussionEntries="[event.discussion?.entries]"
        :discussionInput="event.discussion"
        :organizations="event.orgs"
      />
    </div> -->
    <!-- <EmptyState v-else pageType="discussions" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
defineProps<{
  event: CommunityEvent;
}>();

const aboveMediumBP = useBreakpoint("md");

// const event = {
//   name: "Test Event",
//   discussion: [
//     {
//       id: 1,
//       author: "string",
//       content: "string",
//       votes: 1,
//       date: "datetime",
//     },
//   ],
//   orgs: [],
// };
</script>

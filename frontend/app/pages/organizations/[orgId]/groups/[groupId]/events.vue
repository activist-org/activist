<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Tabs class="pt-2 md:pt-0" :selectedTab="1" :tabs="groupTabs" />
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ group?.name }}&nbsp;{{
          $t("i18n.pages.organizations._global.events_lower")
        }}
      </Title>
    </Head>
    <HeaderAppPageGroup
      :header="
        group?.name + ' ' + $t('i18n.pages.organizations._global.events_lower')
      "
      :tagline="$t('i18n.pages.organizations._global.events_tagline')"
      :underDevelopment="false"
    >
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnRouteInternal
          ariaLabel="i18n.pages.organizations.groups.events.new_group_event_aria_label"
          class="w-max"
          :cta="true"
          fontSize="sm"
          iconSize="1.35em"
          label="i18n._global.new_event"
          :leftIcon="IconMap.PLUS"
          linkTo="/"
        />
        <BtnAction
          @click="downloadCalendarEntries"
          @keydown.enter="downloadCalendarEntries"
          ariaLabel="i18n.pages.organizations._global.subscribe_to_events_aria_label"
          class="w-max"
          :cta="true"
          fontSize="sm"
          iconSize="1.25em"
          label="i18n.pages.organizations._global.subscribe_to_events"
          :leftIcon="IconMap.DATE"
        />
      </div>
    </HeaderAppPageGroup>
    <PagePreviewEvent />
    <div v-if="group?.events && group.events.length > 0" class="space-y-3 py-4">
      <CardSearchResultEntityEvent
        v-for="(u, i) in group.events"
        :key="i"
        :event="u"
        :isReduced="true"
      />
    </div>
    <EmptyState v-else pageType="events" :permission="false" />
  </div>
</template>

<script setup lang="ts">
const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : "";

const { data: group } = useGetGroup(groupId);
const groupTabs = useGetGroupTabs();

const downloadCalendarEntries = () => {};
</script>

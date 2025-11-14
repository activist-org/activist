<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ organization?.name }}&nbsp;{{
          $t("i18n.pages.organizations._global.events_lower")
        }}
      </Title>
    </Head>
    <HeaderAppPageOrganization
      :header="
        organization?.name +
        ' ' +
        $t('i18n.pages.organizations._global.events_lower')
      "
      :tagline="$t('i18n.pages.organizations._global.events_tagline')"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          ariaLabel="i18n.pages.organizations.events.new_org_event_aria_label"
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
    </HeaderAppPageOrganization>
    <div
      v-if="organization?.events && (organization?.events ?? []).length > 0"
      class="space-y-3 py-4"
      data-testid="organization-events-list"
    >
      <CardSearchResultEntityEvent
        v-for="(e, i) in organization?.events"
        :key="i"
        :event="e"
        :isReduced="true"
      />
    </div>
    <EmptyState v-else class="py-4" pageType="events" :permission="false" />
  </div>
</template>

<script setup lang="ts">

const { data: organization } = useGetOrganization(
  useRoute().params.orgId as string
);

const downloadCalendarEntries = () => {};
</script>

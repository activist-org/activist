<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MenuSubPageSelector
    class="pt-2 md:pt-0"
    :selectors="groupSubPages"
    :selectedRoute="1"
  />
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title>
        {{ group.name }}&nbsp;{{
          $t("i18n.pages.organizations._global.events_lower")
        }}
      </Title>
    </Head>
    <HeaderAppPage
      :group="group"
      :header="
        group.name + ' ' + $t('i18n.pages.organizations._global.events_lower')
      "
      :tagline="$t('i18n.pages.organizations._global.events_tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <!-- <BtnAction
          class="w-max"
          :cta="true"
          :label=""i18n._global.support"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.45em"
          :counter="group.supportingUsers"
          ariaLabel="i18n.pages.organizations.groups._global.support_group_aria_label"
        /> -->
      </div>
    </HeaderAppPage>
    <PagePreviewEvent />
    <!-- <div v-if="group.events" class="space-y-3 py-4">
      <CardSearchResultEvent
        v-for="(u, i) in group.events"
        :key="i"
        :isReduced="true"
        :event="u"
      />
    </div>
    <EmptyState v-else pageType="events" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
import type { Group } from "~/types/communities/group";

defineProps<{
  group: Group;
}>();

const groupSubPages = getGroupSubPages();
</script>

<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MenuSubPageSelector
    class="pt-2 md:pt-0"
    :selectors="groupSubPages"
    :selectedRoute="3"
  />
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title>{{ group.name }}&nbsp;{{ $t(i18nMap._global.faq) }}</Title>
    </Head>
    <HeaderAppPage
      :group="group"
      :header="group.name + ' ' + $t(i18nMap._global.faq)"
      :tagline="$t(i18nMap.pages.organizations._global.faq_tagline)"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <!-- <BtnAction
          class="w-max"
          :cta="true"
          :label="i18nMap._global.support"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.45em"
          :counter="group.supportingUsers"
          ariaLabel="
            pages.organizations.groups._global.support_group_aria_label
          "
        /> -->
      </div>
    </HeaderAppPage>
    <div v-if="group.faqEntries" class="py-4">
      <div v-for="f in group.faqEntries" class="mb-4">
        <CardFAQEntry :faqEntry="f" />
      </div>
    </div>
    <EmptyState v-else pageType="faq" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import { i18nMap } from "~/types/i18n-map";
import { getGroupSubPages } from "~/utils/groupSubPages";

const groupSubPages = getGroupSubPages();

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;

const groupStore = useGroupStore();
await groupStore.fetchById(groupId);

const { group } = groupStore;
</script>

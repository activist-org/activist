<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{
          $t(i18nMap.pages._global.discussions_lower)
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="
        organization.name + ' ' + $t(i18nMap.pages._global.discussions_lower)
      "
      :tagline="$t(i18nMap.pages.organizations.discussions.index.tagline)"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          v-if="aboveMediumBP"
          class="block w-max"
          :cta="true"
          linkTo="/"
          :label="i18nMap.pages._global.new_discussion"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          :ariaLabel="i18nMap.pages._global.new_discussion_aria_label"
        />
      </div>
    </HeaderAppPage>
    <!-- <div v-if="organization.discussions" class="space-y-6 pb-6 pt-3 md:pt-4">
      <CardDiscussion
        v-for="(d, i) in organization.discussions"
        :key="i"
        :isPrivate="false"
        :discussion="d"
      />
    </div>
    <EmptyState v-else pageType="discussions" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";

const aboveMediumBP = useBreakpoint("md");

const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);

const { organization } = organizationStore;
</script>

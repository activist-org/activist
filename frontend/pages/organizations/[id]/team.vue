<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{
          $t(i18nMap.pages._global.team.team_lower)
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="
        organization.name + ' ' + $t(i18nMap.pages._global.team.team_lower)
      "
      :tagline="$t(i18nMap.pages.organizations.team.tagline)"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          class="w-max"
          :cta="true"
          :label="i18nMap.pages._global.team.invite_someone"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          :ariaLabel="
            i18nMap.pages.organizations.team.invite_someone_org_aria_label
          "
        />
      </div>
    </HeaderAppPage>
    <div class="space-y-3 py-4"></div>
    <!-- <div v-if="organization.members" class="space-y-3 py-4">
      <CardSearchResultUser
        v-for="(u, i) in organization.members"
        :key="i"
        :isReduced="true"
        :user="u"
      />
    </div>
    <EmptyState v-else pageType="users" :permission="false" class="py-4" /> -->
  </div>
</template>

<script setup lang="ts">
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(id);

const { organization } = organizationStore;
</script>

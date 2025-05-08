<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title>
        {{ organization.name }}&nbsp;{{
          $t("i18n.pages._global.team.team_lower")
        }}
      </Title>
    </Head>
    <HeaderAppPageOrganization
      :header="
        organization.name + ' ' + $t('i18n.pages._global.team.team_lower')
      "
      :tagline="$t('i18n.pages.organizations.team.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          class="w-max"
          :cta="true"
          label="i18n.pages._global.team.invite_someone"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="i18n.pages.organizations.team.invite_someone_org_aria_label"
        />
      </div>
    </HeaderAppPageOrganization>
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
import type { Organization } from "~/types/communities/organization";

import { IconMap } from "~/types/icon-map";

defineProps<{
  organization: Organization;
}>();
</script>

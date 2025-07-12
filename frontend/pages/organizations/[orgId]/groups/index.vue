<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ organization.name }}&nbsp;{{
          $t("i18n.pages.organizations.groups.index.groups_lower")
        }}
      </Title>
    </Head>
    <HeaderAppPageOrganization
      :header="
        organization.name +
        ' ' +
        $t('i18n.pages.organizations.groups.index.groups_lower')
      "
      :tagline="$t('i18n.pages.organizations.groups.index.tagline')"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          class="w-max"
          :cta="true"
          linkTo="/"
          label="i18n._global.new_group"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="i18n.pages.organizations.groups.index.new_group_aria_label"
        />
      </div>
    </HeaderAppPageOrganization>
    <div v-if="organization.groups!.length > 0" class="space-y-3 py-4">
      <CardSearchResultGroup
        v-for="(g, i) in organization.groups"
        :key="i"
        :group="g"
        :isReduced="true"
        :isPrivate="false"
      />
    </div>
    <EmptyState v-else pageType="groups" :permission="false" class="py-4" />
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/communities/organization";

import { IconMap } from "~/types/icon-map";

defineProps<{
  organization: Organization;
}>();
</script>

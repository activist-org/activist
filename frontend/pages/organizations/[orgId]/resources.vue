<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ organization.name }}&nbsp;{{ $t("i18n._global.resources_lower") }}
      </Title>
    </Head>
    <HeaderAppPageOrganization
      :header="organization.name + ' ' + $t('i18n._global.resources_lower')"
      :tagline="$t('i18n.pages.organizations._global.resources_tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          class="w-max"
          :cta="true"
          linkTo="/"
          label="i18n._global.new_resource"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="i18n.pages._global.resources.new_resource_aria_label"
        />
      </div>
    </HeaderAppPageOrganization>
    <div v-if="orgResources.length > 0" class="space-y-3 py-4">
      <CardSearchResultResource
        v-for="(r, i) in orgResources"
        :key="i"
        :isReduced="true"
        :resource="r"
      />
    </div>
    <EmptyState v-else pageType="resources" :permission="false" class="py-4" />
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/communities/organization";
import type { Resource } from "~/types/content/resource";

import { IconMap } from "~/types/icon-map";

defineProps<{
  organization: Organization;
}>();

const orgResources: Resource[] = [];
</script>

<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{
          $t(i18nMap._global.resources_lower)
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="organization.name + ' ' + $t(i18nMap._global.resources_lower)"
      :tagline="$t(i18nMap.pages.organizations._global.resources_tagline)"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          class="w-max"
          :cta="true"
          linkTo="/"
          :label="i18nMap._global.new_resource"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          :ariaLabel="i18nMap.pages._global.resources.new_resource_aria_label"
        />
      </div>
    </HeaderAppPage>
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
import type { Resource } from "~/types/content/resource";
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(id);

const { organization } = organizationStore;

const orgResources: Resource[] = [];
</script>

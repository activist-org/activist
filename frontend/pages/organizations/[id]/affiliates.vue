<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{
          $t(i18nMap.pages.organizations.affiliates.affiliates_lower)
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="
        organization.name +
        ' ' +
        $t(i18nMap.pages.organizations.affiliates.affiliates_lower)
      "
      :tagline="$t(i18nMap.pages.organizations.affiliates.tagline)"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3"></div>
    </HeaderAppPage>
    <!-- <div v-if="orgSupporters.length > 0" class="space-y-3 py-4">
      <CardSearchResultUser
        v-for="(u, i) in orgSupporters"
        :key="i"
        :isReduced="true"
        :user="u"
      />
    </div>
    <EmptyState
      v-else
      pageType="organizations"
      :permission="false"
      class="py-4"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { i18nMap } from '~/types/i18n-map';

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(id);

const { organization } = organizationStore;

// const orgSupporters = [];
</script>

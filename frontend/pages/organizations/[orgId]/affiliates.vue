<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title>
        {{ organization.name }}&nbsp;{{
          $t("i18n.pages.organizations.affiliates.affiliates_lower")
        }}
      </Title>
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="
        organization.name +
        ' ' +
        $t('i18n.pages.organizations.affiliates.affiliates_lower')
      "
      :tagline="$t('i18n.pages.organizations.affiliates.tagline')"
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
const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);

const { organization } = organizationStore;

// const orgSupporters = [];
</script>

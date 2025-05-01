<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="bg-layer-0 px-8 text-primary-text">
    <Head>
      <Title>{{ $t("i18n.pages.organizations.index.header_title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('i18n.pages.organizations.index.header_title')"
      :tagline="$t('i18n.pages.organizations.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <ComboboxTopics />
      </div>
    </HeaderAppPage>
    <div v-if="organizations.length > 0">
      <div v-for="org in organizations" class="space-y-6 pb-6 pt-3 md:pt-4">
        <CardSearchResultOrganization :isPrivate="false" :organization="org" />
      </div>
    </div>
    <EmptyState v-else pageType="organizations" :permission="false" />
  </div>
</template>

<script setup lang="ts">
const organizationStore = useOrganizationStore();
await organizationStore.fetchAll();

const { organizations } = organizationStore;
</script>

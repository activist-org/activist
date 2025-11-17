<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="bg-layer-0 px-8">
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
    <Loading v-if="pending" :loading="pending" />
    <div v-else-if="organizations.length > 0 && !pending">
      <div v-for="org in organizations" class="space-y-6 pb-6 pt-3 md:pt-4">
        <CardSearchResultEntityOrganization
          :isPrivate="false"
          :organization="org"
        />
      </div>
    </div>
    <EmptyState v-else pageType="organizations" :permission="false" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const query = computed(() => route.query);
const { data: organizations, pending } = useGetOrganizations(query);
</script>

<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="bg-layer-0 px-8 text-primary-text">
    <Head>
      <Title>{{ $t("i18n.pages.resources.index.header_title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('i18n.pages.resources.index.header_title')"
      :tagline="$t('i18n.pages.resources.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <ComboboxTopics />
      </div>
    </HeaderAppPage>
    <div v-if="resources">
      <div v-for="resource in resources" class="space-y-6 pb-6 pt-3 md:pt-4">
        <CardSearchResultResource :isPrivate="false" :resource="resource" />
      </div>
    </div>
    <EmptyState v-else pageType="resources" :permission="false" />
  </div>
</template>

<script setup lang="ts">
const { data: resources } = await useFetch(
  `${BASE_BACKEND_URL}/content/resources/`,
  {
    method: "GET",
  }
);
</script>

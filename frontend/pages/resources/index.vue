<template>
  <div
    class="bg-light-layer-0 px-8 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("pages.resources.index.header-title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.resources.index.header-title')"
      :tagline="$t('pages.resources.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <ComboboxTopics />
      </div>
    </HeaderAppPage>
    <div v-if="resources">
      <div v-for="resource in resources" class="space-y-6 pb-6 pt-3 md:pt-4">
        <CardSearchResult
          searchResultType="resource"
          :isPrivate="false"
          :resource="resource"
        />
      </div>
    </div>
    <EmptyState v-else pageType="resources" :permission="false" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "sidebar",
});

const { data: resources } = await useFetch(`${BASE_URL}/content/resources/`, {
  method: "GET",
});
</script>

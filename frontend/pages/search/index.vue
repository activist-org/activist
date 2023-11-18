<template>
  <div
    class="px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("_global.search") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.search.index.header')"
      :tagline="$t('pages.search.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <MarkerTopic topic="My topics dropdown" />
      </div>
    </HeaderAppPage>
    <GridFilterTags :tags="['Berlin', 'Activism', 'Eco']" class="mt-3" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "sidebar",
});
</script>

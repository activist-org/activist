<template>
  <div
    class="px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0"
  >
    <Head>
      <Title>{{ $t("pages.events.search.header-title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.events.search.header-title')"
      :tagline="$t('pages.events.search.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <ComboboxTopics />
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

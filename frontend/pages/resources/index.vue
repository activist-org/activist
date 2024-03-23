<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0 px-8"
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "sidebar",
});
</script>

<template>
  <div
    class="px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
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

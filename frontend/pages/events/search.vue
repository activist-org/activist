<template>
  <div
    class="px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.events.search.title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.events.search.header')"
      :tagline="$t('pages.events.search.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <TopicMarker topic="My topics dropdown" />
      </div>
    </HeaderAppPage>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "sidebar",
});
</script>

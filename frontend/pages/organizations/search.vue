<template>
  <div
    class="px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0"
  >
    <Head>
      <Title>{{ $t("pages.organizations.search.header-title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.organizations.search.header-title')"
      :tagline="$t('pages.organizations.search.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <ShieldTopic topic="My topics dropdown" />
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

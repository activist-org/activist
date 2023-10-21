<template>
  <div
    class="px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.organizations.index.title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.organizations.index.header')"
      :tagline="$t('pages.organizations.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <TopicMarker topic="My topics dropdown" />
      </div>
    </HeaderAppPage>
    <div class="pt-3 pb-6 space-y-6 md:pt-4" v-for="organization in organizations">
      <CardSearchResult
        searchResultType="organization"
        :isPrivate="false"
        :organization="organization"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();
const {data: organizations} = await useFetch(
  "http://localhost:8000/v1/entities/organizations/",
  {
    method: "GET",
  }
);
</script>

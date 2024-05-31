<template>
  <div
    class="px-8 bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("pages.organizations.index.header-title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.organizations.index.header-title')"
      :tagline="$t('pages.organizations.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <ComboboxTopics />
      </div>
    </HeaderAppPage>
    <div v-if="organizations">
      <div
        v-for="organization in organizations"
        class="pt-3 pb-6 space-y-6 md:pt-4"
      >
        <CardSearchResultOrganization
          :isPrivate="false"
          :organization="organization"
        />
      </div>
    </div>
    <EmptyState v-else pageType="organizations" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/organization";
const token = localStorage.getItem("accessToken");
console.log(localStorage.getItem("accessToken"));

const res = await useAsyncData(async () => await fetchWithToken("http://localhost:8000/v1/entities/organizations/"));

console.log(res.data)
const organizations = res.data;
</script>

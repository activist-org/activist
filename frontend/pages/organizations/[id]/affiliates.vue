<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{
          $t("_global.affiliates_lower")
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="organization.name + ' ' + $t('_global.affiliates_lower')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3"></div>
    </HeaderAppPage>
    <PagePreviewAffiliates />
    <!-- <div v-if="organization.supportingUsers" class="space-y-3 py-4">
      <CardSearchResultUser
        v-for="(u, i) in organization.supportingUsers"
        :key="i"
        :isReduced="true"
        :user="u"
      />
    </div>
    <EmptyState v-else pageType="organizations" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
import { testTechOrg } from "~/utils/testEntities";

const organization = testTechOrg;
</script>

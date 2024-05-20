<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{
          $t("_global.discussions_lower")
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="organization.name + ' ' + $t('_global.discussions_lower')"
      :tagline="$t('pages.organizations.discussions.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          class="hidden w-max md:block"
          :cta="true"
          linkTo="/"
          label="components.btn-route-internal.new-discussion"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="components.btn-route-internal.new-discussion-aria-label"
        />
      </div>
    </HeaderAppPage>
    <PagePreviewDiscussion />
    <!-- <div v-if="organization.discussions" class="space-y-6 pb-6 pt-3 md:pt-4">
      <CardDiscussion
        v-for="(d, i) in organization.discussions"
        :key="i"
        :isPrivate="false"
        :discussion="d"
      />
    </div>
    <EmptyState v-else pageType="discussions" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
import { testTechOrg } from "~/utils/testEntities";

const organization = testTechOrg;
</script>

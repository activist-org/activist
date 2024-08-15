<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{ $t("_global.groups_lower") }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="organization.name + ' ' + $t('_global.groups_lower')"
      :tagline="$t('pages.organizations.groups.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          class="w-max"
          :cta="true"
          linkTo="/"
          label="components._global.new_group"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="components.btn_route_internal.new_group_aria_label"
        />
      </div>
    </HeaderAppPage>
    <div v-if="organization.groups" class="space-y-3 py-4">
      <CardSearchResultGroup
        v-for="(g, i) in organization.groups"
        :key="i"
        :group="g"
        :isReduced="true"
        :isPrivate="false"
      />
    </div>
    <EmptyState v-else pageType="organizations" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
import { testTechOrg } from "~/utils/testEntities";

const organization = testTechOrg;
</script>

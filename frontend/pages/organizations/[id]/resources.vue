<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{ $t("_global.resources_lower") }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="organization.name + ' ' + $t('_global.resources_lower')"
      :tagline="$t('pages.organizations.resources.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          class="w-max"
          :cta="true"
          linkTo="/"
          label="components._global.new-resource"
          fontSize="sm"
          leftIcon="bi:plus-lg"
          iconSize="1.35em"
          ariaLabel="components.btn-route-internal.new-resource-aria-label"
        />
      </div>
    </HeaderAppPage>
    <div v-if="organization.resources" class="space-y-3 py-4">
      <CardSearchResultResource
        v-for="(r, i) in organization.resources"
        :key="i"
        :isReduced="true"
        :resource="r"
      />
    </div>
    <EmptyState v-else pageType="resources" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import { testTechOrg } from "~/utils/testEntities";
import useRouteToName from "~/composables/useRouteToName";

definePageMeta({
  layout: "sidebar",
});

const emit = defineEmits(["routeToName"]);
useRouteToName(emit);

const organization = testTechOrg;
</script>

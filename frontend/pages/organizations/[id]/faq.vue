<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ organization.name }}&nbsp;{{ $t("_global.faq") }}</Title>
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="organization.name + ' ' + $t('_global.faq')"
      :tagline="$t('pages.organizations.faq.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          class="w-max"
          :cta="true"
          label="components.btn-action.new-faq"
          fontSize="sm"
          leftIcon="bi:plus-lg"
          iconSize="1.35em"
          ariaLabel="components.btn-action.new-faq-aria-label"
        />
      </div>
    </HeaderAppPage>
    <div v-if="organization.faqEntries" class="py-4">
      <div v-for="f in organization.faqEntries" class="mb-4">
        <CardFAQEntry :faqEntry="f" />
      </div>
    </div>
    <EmptyState v-else pageType="faq" :permission="false" />
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

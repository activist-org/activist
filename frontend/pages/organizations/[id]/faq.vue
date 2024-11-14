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
      :tagline="$t('pages.organizations._global.faq_tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          class="w-max"
          :cta="true"
          label="pages.organizations.faq.new_faq"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="pages.organizations.faq.new_faq_aria_label"
        />
      </div>
    </HeaderAppPage>
    <div v-if="orgFAQs.length > 0" class="py-4">
      <div v-for="f in orgFAQs" class="mb-4">
        <CardFAQEntry :faqEntry="f" />
      </div>
    </div>
    <EmptyState v-else pageType="faq" :permission="false" class="py-4" />
  </div>
</template>

<script setup lang="ts">
import type { FaqEntry } from "~/types/content/faq-entry.d";
import { IconMap } from "~/types/icon-map";

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(id);

const { organization } = organizationStore;

const orgFAQs: FaqEntry[] = [];
</script>

<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title>{{ organization.name }}&nbsp;{{ $t("i18n._global.faq") }}</Title>
    </Head>
    <HeaderAppPageOrganization
      :header="organization.name + ' ' + $t('i18n._global.faq')"
      :tagline="$t('i18n.pages.organizations._global.faq_tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          class="w-max"
          :cta="true"
          label="i18n.pages.organizations.faq.new_faq"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="i18n.pages.organizations.faq.new_faq_aria_label"
        />
      </div>
    </HeaderAppPageOrganization>
    <div v-if="orgFAQs.length > 0" class="py-4">
      <div v-for="f in orgFAQs" class="mb-4">
        <CardFAQEntry :faqEntry="f" />
      </div>
    </div>
    <EmptyState v-else pageType="faq" :permission="false" class="py-4" />
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/communities/organization";
import type { FaqEntry } from "~/types/content/faq-entry.d";

import { IconMap } from "~/types/icon-map";

defineProps<{
  organization: Organization;
}>();

const orgFAQs: FaqEntry[] = [];
</script>

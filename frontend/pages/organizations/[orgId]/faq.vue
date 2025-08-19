<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>{{ organization.name }}&nbsp;{{ $t("i18n._global.faq") }}</Title>
    </Head>
    <HeaderAppPageOrganization
      :header="organization.name + ' ' + $t('i18n._global.faq')"
      :tagline="$t('i18n.pages._global.faq_tagline')"
      :underDevelopment="false"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          @click.stop="
            useModalHandlers('ModalAddFaqEntryOrganization').openModal()
          "
          @keydown.enter="
            useModalHandlers('ModalAddFaqEntryOrganization').openModal()
          "
          class="w-max"
          :cta="true"
          label="i18n.pages._global.new_faq"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="i18n.pages._global.new_faq_aria_label"
        />
        <ModalFaqEntryOrganization />
      </div>
    </HeaderAppPageOrganization>
    <div v-if="organization.faqEntries!.length > 0" class="py-4">
      <div v-for="f in organization.faqEntries" class="mb-4">
        <CardFAQEntry :pageType="'organization'" :faqEntry="f" />
      </div>
    </div>
    <EmptyState v-else pageType="faq" :permission="false" class="py-4" />
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/communities/organization";

import { IconMap } from "~/types/icon-map";

defineProps<{
  organization: Organization;
}>();
</script>

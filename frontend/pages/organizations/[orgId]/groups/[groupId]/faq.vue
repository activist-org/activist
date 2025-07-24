<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MenuSubPageSelector
    class="pt-2 md:pt-0"
    :selectors="groupSubPages"
    :selectedRoute="3"
  />
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>{{ group.name }}&nbsp;{{ $t("i18n._global.faq") }}</Title>
    </Head>
    <HeaderAppPageGroup
      :header="group.name + ' ' + $t('i18n._global.faq')"
      :tagline="$t('i18n.pages._global.faq_tagline')"
      :underDevelopment="false"
    >
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnAction
          @click.stop="useModalHandlers('ModalAddFaqEntry').openModal()"
          @keydown.enter="useModalHandlers('ModalAddFaqEntry').openModal()"
          class="w-max"
          :cta="true"
          label="i18n._global.new_faq"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="i18n.pages._global.new_faq_aria_label"
        />
        <ModalAddFaqEntry pageType="group" />
      </div>
    </HeaderAppPageGroup>
    <div v-if="group.faqEntries!.length > 0" class="py-4">
      <div v-for="f in group.faqEntries" class="mb-4">
        <CardFAQEntry :pageType="'group'" :faqEntry="f" />
      </div>
    </div>
    <EmptyState v-else pageType="faq" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import type { Group } from "~/types/communities/group";

import { IconMap } from "~/types/icon-map";

defineProps<{
  group: Group;
}>();

const groupSubPages = getGroupSubPages();
</script>

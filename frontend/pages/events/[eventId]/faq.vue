<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>{{ event.name }}&nbsp;{{ $t("i18n._global.faq") }}</Title>
    </Head>
    <HeaderAppPageOrganization
      :header="event.name + ' ' + $t('i18n._global.faq')"
      :tagline="$t('i18n.pages._global.faq_tagline')"
      :underDevelopment="false"
    >
      <div class="flex space-x-2 lg:space-x-3">
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
        <ModalAddFaqEntry pageType="event" />
      </div>
    </HeaderAppPageOrganization>
    <div v-if="event.faqEntries!.length > 0" class="py-4">
      <div v-for="f in event.faqEntries" class="mb-4">
        <CardFAQEntry :pageType="'event'" :faqEntry="f" />
      </div>
    </div>
    <EmptyState v-else pageType="faq" :permission="false" class="py-4" />
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/events/event";

import { IconMap } from "~/types/icon-map";

defineProps<{
  event: Event;
}>();
</script>

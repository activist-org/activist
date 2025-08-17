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
          @click.stop="useModalHandlers('ModalAddFaqEntryEvent').openModal()"
          @keydown.enter="useModalHandlers('ModalAddFaqEntryEvent').openModal()"
          class="w-max"
          :cta="true"
          label="i18n.pages._global.new_faq"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="i18n.pages._global.new_faq_aria_label"
        />
        <ModalAddFaqEntryEvent />
      </div>
    </HeaderAppPageOrganization>

    <div v-if="faqList.length > 0" class="py-4">
      <draggable
        v-model="faqList"
        @end="onDragEnd"
        item-key="id"
        class="space-y-4"
      >
        <template #item="{ element }">
          <CardFAQEntry :pageType="'event'" :faqEntry="element" />
        </template>
      </draggable>
    </div>

    <EmptyState v-else pageType="faq" :permission="false" class="py-4" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import draggable from "vuedraggable";

import type { FaqEntry } from "~/types/content/faq-entry";
import type { Event } from "~/types/events/event";

import { useEventStore } from "~/stores/event";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{ event: Event }>();
const eventStore = useEventStore();

const faqList = ref<FaqEntry[]>([...(props.event?.faqEntries || [])]);

watch(
  () => props.event?.faqEntries,
  (newVal) => {
    if (faqList.value.length === 0) {
      faqList.value = newVal?.slice() ?? [];
    }
  },
  { immediate: true }
);

async function onDragEnd() {
  await eventStore.reorderFaqEntries(props.event, faqList.value);
}
</script>

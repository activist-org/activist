<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>{{ event?.name }}&nbsp;{{ $t("i18n._global.faq") }}</Title>
    </Head>
    <HeaderAppPageEvent
      :header="event?.name + ' ' + $t('i18n._global.faq')"
      :tagline="$t('i18n.pages._global.faq_tagline')"
      :underDevelopment="false"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <ModalFaqEntryEvent />
        <BtnActionAdd
          ariaLabel="i18n.pages._global.new_faq_aria_label"
          :element="$t('i18n._global.faq')"
          :onClick="openModal"
        />
      </div>
    </HeaderAppPageEvent>
    <div v-if="faqList.length > 0" class="py-4" data-testid="event-faq-list">
      <draggable
        v-model="faqList"
        @end="onDragEnd"
        :animation="150"
        :chosen-class="'sortable-chosen'"
        class="space-y-4"
        :delay="0"
        :delay-on-touch-start="false"
        direction="vertical"
        :disabled="false"
        :distance="5"
        drag-class="sortable-drag"
        fallback-class="sortable-fallback"
        :fallback-tolerance="0"
        :force-fallback="false"
        ghost-class="sortable-ghost"
        handle=".drag-handle"
        :invert-swap="false"
        item-key="id"
        :swap-threshold="0.5"
        :touch-start-threshold="3"
      >
        <template #item="{ element }">
          <CardFAQEntry
            @delete-faq="handleDeleteFAQ"
            :entity="event"
            :faqEntry="element"
            :pageType="EntityType.EVENT"
          />
        </template>
      </draggable>
    </div>
    <EmptyState v-else class="py-4" pageType="faq" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import type { FaqEntry } from "#shared/types/faq-entry";

import { EntityType } from "#shared/types/entity";
import draggable from "vuedraggable";

import { useEventFAQEntryMutations } from "~/composables/mutations";
import { useGetEvent } from "~/composables/queries";

const { openModal } = useModalHandlers("ModalFAQEntryEvent");

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : "";

const { data: event } = useGetEvent(eventId);
const { reorderFAQs, deleteFAQ } = useEventFAQEntryMutations(eventId);

const faqList = ref<FaqEntry[]>([...(event?.value?.faqEntries || [])]);

watch(
  () => event?.value?.faqEntries,
  (newVal) => {
    faqList.value = newVal?.slice() ?? [];
  },
  { immediate: true }
);

async function onDragEnd() {
  faqList.value.forEach((faq, index) => {
    faq.order = index;
  });

  await reorderFAQs(faqList.value);
}

async function handleDeleteFAQ(faqId: string) {
  await deleteFAQ(faqId);
}
</script>

<style scoped>
.sortable-ghost {
  opacity: 0.4;
  transition: opacity 0.05s ease;
}

.sortable-chosen {
  background-color: rgba(0, 0, 0, 0.1);
  transition: background-color 0.05s ease;
}

.sortable-drag {
  transform: rotate(5deg);
  transition: transform 0.05s ease;
}

.sortable-fallback {
  display: none;
}

/* Ensure drag handles work properly. */
.drag-handle {
  user-select: none;
}
</style>

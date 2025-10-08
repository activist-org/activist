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
          @click.stop="useModalHandlers('ModalFaqEntryEvent').openModal()"
          @keydown.enter="useModalHandlers('ModalFaqEntryEvent').openModal()"
          ariaLabel="i18n.pages._global.new_faq_aria_label"
          class="w-max"
          :cta="true"
          fontSize="sm"
          iconSize="1.35em"
          label="i18n.pages._global.new_faq"
          :leftIcon="IconMap.PLUS"
        />
        <ModalFaqEntryEvent />
      </div>
    </HeaderAppPageOrganization>

    <!-- FAQ list with drag-and-drop -->
    <div v-if="faqList.length > 0" class="py-4">
      <draggable
        v-model="faqList"
        @end="onDragEnd"
        :animation="150"
        :chosen-class="'sortable-chosen'"
        class="space-y-4"
        data-testid="event-faq-list"
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
          <CardFAQEntry :faqEntry="element" :pageType="'event'" />
        </template>
      </draggable>
    </div>

    <EmptyState v-else class="py-4" pageType="faq" :permission="false" />
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

const faqList = ref<FaqEntry[]>([]);

watch(
  () => props.event?.faqEntries,
  (newVal) => {
    faqList.value = newVal?.slice() ?? [];
  },
  { immediate: true }
);

async function onDragEnd() {
  faqList.value.forEach((faq, index) => {
    faq.order = index;
  });

  await eventStore.reorderFaqEntries(props.event, faqList.value);
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

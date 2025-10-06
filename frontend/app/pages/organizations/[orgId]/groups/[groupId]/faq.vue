<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Tabs class="pt-2 md:pt-0" :tabs="groupTabs" :selectedTab="3" />
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>{{ props.group.name }}&nbsp;{{ $t("i18n._global.faq") }}</Title>
    </Head>

    <HeaderAppPageGroup
      :header="props.group.name + ' ' + $t('i18n._global.faq')"
      :tagline="$t('i18n.pages._global.faq_tagline')"
      :underDevelopment="false"
    >
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnAction
          @click.stop="useModalHandlers('ModalFaqEntryGroup').openModal()"
          @keydown.enter="useModalHandlers('ModalFaqEntryGroup').openModal()"
          class="w-max"
          :cta="true"
          label="i18n.pages._global.new_faq"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="i18n.pages._global.new_faq_aria_label"
        />
        <ModalFaqEntryGroup />
      </div>
    </HeaderAppPageGroup>

    <div
      v-if="props.group.faqEntries?.length"
      class="py-4"
      data-testid="organization-group-faq-list"
    >
      <draggable
        v-model="faqList"
        @end="onDragEnd"
        item-key="id"
        class="space-y-4"
        :touch-start-threshold="3"
        :force-fallback="false"
        :fallback-tolerance="0"
        :delay="0"
        :delay-on-touch-start="false"
        :swap-threshold="0.5"
        :invert-swap="false"
        :direction="'vertical'"
        :disabled="false"
        :animation="150"
        :ghost-class="'sortable-ghost'"
        :chosen-class="'sortable-chosen'"
        :drag-class="'sortable-drag'"
        :handle="'.drag-handle'"
        :distance="5"
        :fallback-class="'sortable-fallback'"
      >
        <template #item="{ element }">
          <CardFAQEntry pageType="group" :faqEntry="element" />
        </template>
      </draggable>
    </div>

    <EmptyState v-else pageType="faq" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import draggable from "vuedraggable";

import type { Group } from "~/types/communities/group";
import type { FaqEntry } from "~/types/content/faq-entry";

import { useGroupStore } from "~/stores/group";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{ group: Group }>();

const groupTabs = getGroupTabs();
const groupStore = useGroupStore();

const faqList = ref<FaqEntry[]>([...(props.group.faqEntries || [])]);

watch(
  () => props.group.faqEntries,
  (newVal) => {
    faqList.value = newVal?.slice() ?? [];
  },
  { immediate: true }
);

const onDragEnd = async () => {
  faqList.value.forEach((faq, index) => {
    faq.order = index;
  });

  await groupStore.reorderFaqEntries(props.group, faqList.value);
};
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

/* Ensure drag handles work properly */
.drag-handle {
  user-select: none;
}
</style>

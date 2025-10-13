<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Tabs class="pt-2 md:pt-0" :selectedTab="3" :tabs="groupTabs" />
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
          @click.stop="openModal()"
          @keydown.enter="openModal()"
          ariaLabel="i18n.pages._global.new_faq_aria_label"
          class="w-max"
          :cta="true"
          fontSize="sm"
          iconSize="1.35em"
          label="i18n.pages._global.new_faq"
          :leftIcon="IconMap.PLUS"
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
        :animation="150"
        chosen-class="sortable-chosen"
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
          <CardFAQEntry :faqEntry="element" pageType="group" />
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

import { useGroupFAQEntryMutations } from "~/composables/mutations/useGroupFAQEntryMutations";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{ group: Group }>();

const { openModal } = useModalHandlers("ModalFaqEntryGroup");

const groupTabs = getGroupTabs();
const { reorderFAQs } = useGroupFAQEntryMutations(props.group.id);
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

  await reorderFAQs(faqList.value);
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

/* Ensure drag handles work properly. */
.drag-handle {
  user-select: none;
}
</style>

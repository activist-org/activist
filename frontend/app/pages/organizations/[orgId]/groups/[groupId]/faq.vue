<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Tabs class="pt-2 md:pt-0" :selectedTab="3" :tabs="groupTabs" />
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>{{ group?.name }}&nbsp;{{ $t("i18n._global.faq") }}</Title>
    </Head>
    <HeaderAppPageGroup
      :header="group?.name + ' ' + $t('i18n._global.faq')"
      :tagline="$t('i18n.pages._global.faq_tagline')"
      :underDevelopment="false"
    >
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <ModalFaqEntryGroup />
        <BtnActionAdd
          ariaLabel="i18n.pages._global.new_faq_aria_label"
          :element="$t('i18n._global.faq')"
          :onClick="openModal"
        />
      </div>
    </HeaderAppPageGroup>
    <div
      v-if="faqList.length > 0"
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
        <template #item="{ element, index }">
          <CardFAQEntry
            :key="element.id"
            :ref="(el: CardExpose) => (faqCardList[index] = el?.root)"
            @delete-faq="handleDeleteFAQ"
            @focus="onFocus(index)"
            @keydown.down.prevent="moveDown()"
            @keydown.up.prevent="moveUp()"
            :class="{
              selected: selectedIndex === index,
            }"
            :entity="group"
            :faqEntry="element"
            :pageType="EntityType.GROUP"
            tabindex="0"
          />
        </template>
      </draggable>
    </div>
    <EmptyState v-else pageType="faq" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";

const groupTabs = useGetGroupTabs();

const { openModal } = useModalHandlers("ModalFaqEntryGroup");

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : "";

const { data: group } = useGetGroup(groupId);
const { reorderFAQs, deleteFAQ } = useGroupFAQEntryMutations(groupId);

const faqList = ref<FaqEntry[]>([...(group?.value?.faqEntries || [])]);
const faqCardList = ref<(HTMLElement | null)[]>([]);

const { selectedIndex, onFocus, moveUp, moveDown } =
  useDraggableKeyboardNavigation(faqList, reorderFAQs, faqCardList);

export type CardExpose = {
  root: HTMLElement | null;
};

watch(
  () => group?.value?.faqEntries,
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

const handleDeleteFAQ = async (faqId: string) => {
  await deleteFAQ(faqId);
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

.selected {
  transform: scale(1.025);
  background: highlight;
}
</style>

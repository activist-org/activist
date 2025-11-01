<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>{{ organization?.name }}&nbsp;{{ $t("i18n._global.faq") }}</Title>
    </Head>
    <HeaderAppPageOrganization
      :header="organization?.name + ' ' + $t('i18n._global.faq')"
      :tagline="$t('i18n.pages._global.faq_tagline')"
      :underDevelopment="false"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnActionAdd
          ariaLabel="i18n.pages._global.new_faq_aria_label"
          :element="$t('i18n._global.faq')"
          :onClick="useModalHandlers('ModalFaqEntryOrganization').openModal"
        />
        <ModalFaqEntryOrganization />
      </div>
    </HeaderAppPageOrganization>
    <div v-if="(organization?.faqEntries || []).length > 0" class="py-4">
      <!-- Draggable list -->
      <draggable
        v-model="faqList"
        @end="onDragEnd"
        :animation="150"
        chosen-class="sortable-chosen"
        class="space-y-4"
        data-testid="organization-faq-list"
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
            :entity="organization"
            :faqEntry="element"
            :pageType="EntityType.ORGANIZATION"
          />
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

import { useOrganizationFAQEntryMutations } from "~/composables/mutations/useOrganizationFAQEntryMutations";
import { useGetOrganization } from "~/composables/queries/useGetOrganization";
import { EntityType } from "~/types/entity";

const { data: organization } = useGetOrganization(
  useRoute().params.orgId as string
);

const { reorderFAQs } = useOrganizationFAQEntryMutations(
  useRoute().params.orgId as string
);

const faqList = ref<FaqEntry[]>([...(organization?.value?.faqEntries || [])]);

watch(
  () => organization?.value?.faqEntries,
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

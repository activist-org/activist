<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div v-if="props.organization">
    <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
      <Head>
        <Title>{{ props.organization.name }}&nbsp;{{ $t("i18n._global.faq") }}</Title>
      </Head>

      <HeaderAppPageOrganization
        :header="props.organization.name + ' ' + $t('i18n._global.faq')"
        :tagline="$t('i18n.pages._global.faq_tagline')"
        :underDevelopment="false"
      >
        <div class="flex space-x-2 lg:space-x-3">
          <BtnAction
            @click.stop="useModalHandlers('ModalAddFaqEntryOrganization').openModal()"
            @keydown.enter="useModalHandlers('ModalAddFaqEntryOrganization').openModal()"
            class="w-max"
            :cta="true"
            label="i18n.pages._global.new_faq"
            fontSize="sm"
            :leftIcon="IconMap.PLUS"
            iconSize="1.35em"
            ariaLabel="i18n.pages._global.new_faq_aria_label"
          />
          <ModalAddFaqEntryOrganization />
        </div>
      </HeaderAppPageOrganization>

      <div v-if="props.organization.faqEntries?.length" class="py-4">
        <draggable
          v-model="faqList"
          item-key="id"
          @end="onDragEnd"
          class="space-y-4"
        >
          <template #item="{ element }">
            <CardFAQEntry pageType="organization" :faqEntry="element" />
          </template>
        </draggable>
      </div>

      <EmptyState
        v-else
        pageType="faq"
        :permission="false"
        class="py-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/communities/organization";
import type { FaqEntry } from "~/types/content/faq-entry";
import { IconMap } from "~/types/icon-map";
import draggable from "vuedraggable";
import { ref, watch } from "vue";
import { useOrganizationStore } from "~/stores/organization";

const props = defineProps<{ organization: Organization }>();

const orgStore = useOrganizationStore();

const faqList = ref<FaqEntry[]>([...(props.organization.faqEntries || [])]);

watch(
  () => props.organization.faqEntries,
  (newVal) => {
    faqList.value = newVal?.slice() ?? [];
  },
  { immediate: true }
);

const onDragEnd = async () => {
  faqList.value.forEach((faq, index) => {
    faq.order = index; 
  })

  await orgStore.reorderFaqEntries(props.organization, faqList.value)
}
</script>

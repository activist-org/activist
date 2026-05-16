<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Disclosure v-slot="{ open }" as="div" class="card-style" v-bind="$attrs">
    <div ref="root" data-testid="faq-card" :tabindex="tabindex ?? 0">
      <div class="flex items-center gap-2">
        <DisclosureButton
          class="flex-1 rounded-md px-4 py-2 focus-brand"
          data-testid="faq-disclosure-button"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <IconDraggableEdit
                :aria-label="$t('i18n.components._global.draggable_element')"
                class="drag-handle -mr-2 cursor-grab select-none"
                data-testid="faq-drag-handle"
                :entity="entity"
                size="1em"
                tabindex="-1"
              />
              <div class="flex text-primary-text">
                <Icon
                  v-if="open"
                  data-testid="faq-chevron-up"
                  :name="IconMap.CHEVRON_UP"
                />
                <Icon
                  v-else
                  data-testid="faq-chevron-down"
                  :name="IconMap.CHEVRON_DOWN"
                />
              </div>
            </div>
            <div class="flex w-full text-left">
              <p data-testid="faq-question">
                {{ faqEntry.question }}
              </p>
            </div>
          </div>
        </DisclosureButton>
        <div class="flex gap-2 pr-2">
          <IconEdit
            @click="
              openModalEditFAQ({ faqEntry: faqEntry, entityId: entity?.id })
            "
            class="flex"
            data-testid="faq-edit-button"
            :entity="entity"
          />
          <IconDelete
            @click.stop="
              openModalDeleteFAQ({
                entityId: entity?.id,
                faqEntryId: faqEntry.id,
              })
            "
            @keydown.enter="
              openModalDeleteFAQ({
                entityId: entity?.id,
                faqEntryId: faqEntry.id,
              })
            "
            :aria-label="$t('i18n.components.card_faq_entry.delete_aria_label')"
            class="flex"
            data-testid="faq-delete-button"
          />
        </div>
      </div>
      <DisclosurePanel
        class="mt-2 border-t border-section-div py-2 pl-4 focus-within:border-0"
        data-testid="faq-disclosure-panel"
      >
        <p class="select-text text-left" data-testid="faq-answer">
          {{ faqEntry.answer }}
        </p>
      </DisclosurePanel>
    </div>
  </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  faqEntry: FaqEntry;
  pageType: EntityType;
  entity?: Entity | null;
  tabindex?: number;
}>();

const modalName = computed(
  () =>
    `ModalFaqEntry${props.pageType.charAt(0).toUpperCase() + props.pageType.slice(1)}`
);

const { openModal: openModalEditFAQ } = useModalHandlers(modalName.value);

const { openModal: openModalDeleteFAQ } = useModalHandlers(
  `ModalFaqEntryDelete${props.pageType.charAt(0).toUpperCase() + props.pageType.slice(1)}`
);

const root = ref<HTMLElement | null>(null);
defineExpose({ root });
</script>

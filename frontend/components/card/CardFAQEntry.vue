<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Disclosure
    v-slot="{ open }"
    as="div"
    class="card-style"
    data-testid="faq-card"
  >
    <DisclosureButton
      class="focus-brand w-full rounded-md px-4 py-2"
      data-testid="faq-disclosure-button"
    >
      <div
        class="flex gap-3"
        :class="{ 'items-center': !open, 'items-start': open }"
      >
        <Icon
          class="drag-handle -mr-2 cursor-grab select-none"
          :name="IconMap.GRIP"
          size="1em"
          :aria-label="$t('i18n.components._global.draggable_element')"
          data-testid="faq-drag-handle"
        />
        <div class="text-primary-text">
          <Icon
            v-if="open"
            :name="IconMap.CHEVRON_UP"
            data-testid="faq-chevron-up"
          />
          <Icon
            v-else
            :name="IconMap.CHEVRON_DOWN"
            data-testid="faq-chevron-down"
          />
        </div>
        <div class="flex-col">
          <div
            class="flex select-text items-center gap-3 text-left text-primary-text"
          >
            <p data-testid="faq-question">
              {{ faqEntry.question }}
            </p>
            <IconEdit
              @click.stop="
                useModalHandlers(
                  `ModalFaqEntry${props.pageType.charAt(0).toUpperCase() + props.pageType.slice(1)}` +
                    props.faqEntry.id
                ).openModal()
              "
              @keydown.enter="
                useModalHandlers(
                  `ModalFaqEntry${props.pageType.charAt(0).toUpperCase() + props.pageType.slice(1)}` +
                    props.faqEntry.id
                ).openModal()
              "
              data-testid="faq-edit-button"
            />
            <ModalFaqEntryOrganization
              v-if="pageType === 'organization'"
              :faqEntry="faqEntry"
            />
            <ModalFaqEntryGroup
              v-else-if="pageType === 'group'"
              :faqEntry="faqEntry"
            />
            <ModalFaqEntryEvent
              v-else-if="pageType === 'event'"
              :faqEntry="faqEntry"
            />
          </div>
          <DisclosurePanel
            class="mt-2 border-t border-section-div py-2 focus-within:border-0"
            data-testid="faq-disclosure-panel"
          >
            <p class="select-text text-left" data-testid="faq-answer">
              {{ faqEntry.answer }}
            </p>
          </DisclosurePanel>
        </div>
      </div>
    </DisclosureButton>
  </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";

import type { FaqEntry } from "~/types/content/faq-entry";

import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  faqEntry: FaqEntry;
  pageType: "organization" | "group" | "event";
}>();
</script>

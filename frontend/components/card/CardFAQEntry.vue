<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Disclosure v-slot="{ open }" as="div" class="card-style flex items-start">
    <div
      class="cursor-grab p-2 text-gray-400 hover:text-gray-600"
      title="Drag to reorder"
      @mousedown.stop
    >
    </div>

    <div class="flex-1">
      <DisclosureButton class="focus-brand w-full rounded-md px-4 py-2">
        <div
          class="flex gap-3"
          :class="{ 'items-center': !open, 'items-start': open }"
        >
          <div class="text-primary-text">
            <Icon v-if="open" :name="IconMap.CHEVRON_UP" />
            <Icon v-else :name="IconMap.CHEVRON_DOWN" />
          </div>
          <div class="flex-col">
            <div
              class="flex select-text items-center gap-3 text-left text-primary-text"
            >
              <p>{{ faqEntry.question }}</p>
              <IconEdit
                @click.stop="
                  useModalHandlers(
                    `ModalEditFaqEntry${props.pageType.charAt(0).toUpperCase() + props.pageType.slice(1)}` +
                      props.faqEntry.id
                  ).openModal()
                "
                @keydown.enter="
                  useModalHandlers(
                    `ModalEditFaqEntry${props.pageType.charAt(0).toUpperCase() + props.pageType.slice(1)}` +
                      props.faqEntry.id
                  ).openModal()
                "
              />
              <ModalEditFaqEntryOrganization
                v-if="pageType === 'organization'"
                :faqEntry="faqEntry"
              />
              <ModalEditFaqEntryGroup
                v-else-if="pageType === 'group'"
                :faqEntry="faqEntry"
              />
              <ModalEditFaqEntryEvent
                v-else-if="pageType === 'event'"
                :faqEntry="faqEntry"
              />
            </div>
            <DisclosurePanel
              class="mt-2 border-t border-section-div py-2 focus-within:border-0"
            >
              <p class="select-text text-left">
                {{ faqEntry.answer }}
              </p>
            </DisclosurePanel>
          </div>
        </div>
      </DisclosureButton>
    </div>
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

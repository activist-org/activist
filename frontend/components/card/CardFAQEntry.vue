<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Disclosure v-slot="{ open }" as="div" class="card-style">
    <DisclosureButton class="focus-brand w-full rounded-md px-4 py-2">
      <div
        class="flex gap-3"
        :class="{ 'items-center': !open, 'items-start': open }"
      >
        <div>
          <Icon v-if="open" :name="IconMap.CHEVRON_UP" />
          <Icon v-else :name="IconMap.CHEVRON_DOWN" />
        </div>
        <div class="flex-col">
          <div class="flex select-none items-center gap-3 text-primary-text">
            <p>{{ faqEntry.question }}</p>
            <IconEdit @click.stop="openModal()" @keydown.enter="openModal()" />
            <ModalEditFaqEntry
              @closeModal="handleCloseModal"
              :faqEntry="faqEntry"
              :sectionsToEdit="[
                $t('i18n.components.card_faq_entry.question'),
                $t('i18n.components.card_faq_entry.answer'),
              ]"
              :textsToEdit="[faqEntry.question, faqEntry.answer]"
              :isOpen="modalIsOpen"
            />
          </div>
          <DisclosurePanel
            class="mt-2 border-t border-section-div py-2 focus-within:border-0"
          >
            <p class="select-text text-left text-primary-text">
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

defineProps<{
  faqEntry: FaqEntry;
}>();

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>

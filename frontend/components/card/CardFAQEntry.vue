<template>
  <Disclosure v-slot="{ open }" as="div" class="card-style">
    <DisclosureButton class="w-full px-4 py-2 focus-brand rounded-md">
      <div
        class="flex items-center select-none gap-3 text-light-text dark:text-dark-text"
      >
        <p>{{ faqEntry.question }}</p>
        <Icon name="bi:pencil-square" size="1.2em" />

        <Icon v-if="open" name="bi:chevron-up" />
        <Icon v-else name="bi:chevron-down" />
      </div>
      <DisclosurePanel
        class="py-2 mt-2 border-t focus-within:border-0 border-light-section-div dark:border-dark-section-div"
      >
        <p class="text-left select-text text-light-text dark:text-dark-text">
          {{ faqEntry.answer }}
        </p>
      </DisclosurePanel>
    </DisclosureButton>
  </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import type { FaqEntry } from "~/types/card-faq-entry";

defineProps<{
  faqEntry: FaqEntry;
}>();
</script>

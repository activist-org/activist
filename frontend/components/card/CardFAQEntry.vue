<template>
  <Disclosure v-slot="{ open }" as="div" class="card-style">
    <DisclosureButton class="focus-brand w-full rounded-md px-4 py-2">
      <div
        class="text-light-text dark:text-dark-text flex select-none items-center gap-3"
      >
        <p>{{ faqEntry.question }}</p>
        <Icon name="bi:pencil-square" size="1.2em" />

        <Icon v-if="open" name="bi:chevron-up" />
        <Icon v-else name="bi:chevron-down" />
      </div>
      <DisclosurePanel
        class="border-light-section-div dark:border-dark-section-div mt-2 border-t py-2 focus-within:border-0"
      >
        <p class="text-light-text dark:text-dark-text select-text text-left">
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

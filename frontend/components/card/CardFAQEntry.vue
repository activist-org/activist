<template>
  <Disclosure v-slot="{ open }" as="div" class="card-style">
    <DisclosureButton class="focus-brand px-4 py-2 rounded-md w-full">
      <div
        class="flex gap-3 items-center text-light-text dark:text-dark-text select-none"
      >
        <p>{{ faqEntry.question }}</p>
        <Icon name="bi:pencil-square" size="1.2em" />

        <Icon v-if="open" name="bi:chevron-up" />
        <Icon v-else name="bi:chevron-down" />
      </div>
      <DisclosurePanel
        class="border-t focus-within:border-0 border-light-section-div dark:border-dark-section-div mt-2 py-2"
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
import { FaqEntry } from "~/types/card-faq-entry";

defineProps<{
  faqEntry: FaqEntry;
}>();
</script>

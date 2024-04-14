<template>
  <Disclosure v-slot="{ open }" as="div" class="card-style">
    <DisclosureButton class="focus-brand w-full rounded-md px-4 py-2">
      <div
        class="flex select-none items-center gap-3 text-light-text dark:text-dark-text"
      >
        <p>{{ faqEntry.question }}</p>
        <IconEdit />
        <Icon v-if="open" name="bi:chevron-up" />
        <Icon v-else name="bi:chevron-down" />
      </div>
      <DisclosurePanel
        class="mt-2 border-t border-light-section-div py-2 focus-within:border-0 dark:border-dark-section-div"
      >
        <p class="select-text text-left text-light-text dark:text-dark-text">
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

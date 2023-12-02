<template>
  <Disclosure
    v-slot="{ open }"
    as="div"
    class="flex flex-col gap-3 rounded-md border-light-section-div dark:border-dark-section-div bg-light-header dark:bg-dark-header active:bg-light-highlight dark:active:bg-dark-highlight hover:cursor-pointer shadow-sm shadow-zinc-700 focus-brand border"
  >
    <DisclosureButton class="focus-brand px-4 py-2 rounded-md">
      <div
        class="flex gap-3 items-center text-light-text dark:text-dark-text select-none"
      >
        <Icon name="IconLegal" class="fill-light-text dark:fill-dark-text" />
        <p>{{ $t("components.card-legal-disclaimer.header") }}</p>
        <Icon v-if="open" name="bi:chevron-up" />
        <Icon v-else name="bi:chevron-down" />
      </div>
      <DisclosurePanel
        class="border-t focus-within:border-0 border-light-section-div dark:border-dark-section-div mt-2 py-2"
      >
        <p
          class="text-left select-text text-light-special-text dark:text-dark-special-text"
        >
          {{ disclaimer }}
        </p>
      </DisclosurePanel>
    </DisclosureButton>
  </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";

defineProps<{
  disclaimer: string;
}>();
</script>

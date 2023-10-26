<template>
  <Disclosure
    v-slot="{ open }"
    as="div"
    class="flex flex-col px-4 py-2 mb-1 border select-none gap-3 rounded-md border-light-section-div dark:border-dark-section-div bg-light-header dark:bg-dark-header active:bg-light-highlight dark:active:bg-dark-highlight hover:cursor-pointer shadow-sm shadow-zinc-700"
  >
    <DisclosureButton class="flex items-center gap-3 dark:text-light-distinct">
      <Icon name="IconLegal" class="fill-light-text dark:fill-dark-text" />
      <p>{{ $t("components.card-legal-disclaimer.header") }}</p>
      <Icon v-if="open" name="bi:chevron-up" />
      <Icon v-else name="bi:chevron-down" />
    </DisclosureButton>

    <DisclosurePanel
      class="border-t border-light-section-div dark:border-dark-section-div"
    >
      <p
        class="pt-2 select-text text-light-special-text dark:text-dark-special-text"
      >
        {{ disclaimer }}
      </p>
    </DisclosurePanel>

  </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";

defineProps<{
  disclaimer: string;
}>();
</script>

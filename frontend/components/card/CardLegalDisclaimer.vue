<template>
  <Disclosure
    v-slot="{ open }"
    as="div"
    class="flex flex-col gap-3 rounded-md hover:cursor-pointer elem-on-card-style focus-brand"
  >
    <DisclosureButton class="px-4 py-2 focus-brand rounded-md">
      <div
        class="flex items-center select-none gap-3 text-light-text dark:text-dark-text"
      >
        <Icon name="IconLegal" class="fill-light-text dark:fill-dark-text" />
        <p>{{ $t("components.card-legal-disclaimer.header") }}</p>
        <Icon v-if="open" name="bi:chevron-up" />
        <Icon v-else name="bi:chevron-down" />
      </div>
      <DisclosurePanel
        class="py-2 mt-2 border-t focus-within:border-0 border-light-section-div dark:border-dark-section-div"
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

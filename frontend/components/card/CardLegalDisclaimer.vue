<template>
  <Disclosure
    v-slot="{ open }"
    as="div"
    class="elem-on-card-style focus-brand flex flex-col gap-3 rounded-md hover:cursor-pointer"
  >
    <DisclosureButton class="focus-brand rounded-md px-4 py-2">
      <div
        class="text-light-text dark:text-dark-text flex select-none items-center gap-3"
      >
        <Icon name="IconLegal" class="fill-light-text dark:fill-dark-text" />
        <p>{{ $t("components.card-legal-disclaimer.header") }}</p>
        <Icon v-if="open" name="bi:chevron-up" />
        <Icon v-else name="bi:chevron-down" />
      </div>
      <DisclosurePanel
        class="border-light-section-div dark:border-dark-section-div mt-2 border-t py-2 focus-within:border-0"
      >
        <p
          class="text-light-distinct-text dark:text-dark-distinct-text select-text text-left"
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

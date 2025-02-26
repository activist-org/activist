<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Disclosure
    v-slot="{ open }"
    as="div"
    class="elem-on-card-style focus-brand flex flex-col gap-3 rounded-md hover:cursor-pointer"
  >
    <DisclosureButton class="focus-brand rounded-md px-4 py-2">
      <div class="flex select-none items-center gap-3 text-primary-text">
        <Icon :name="IconMap.LEGAL" class="fill-primary-text" />
        <p>{{ $t("i18n.components.card_legal_disclaimer.header") }}</p>
        <Icon v-if="open" :name="IconMap.CHEVRON_UP" />
        <Icon v-else :name="IconMap.CHEVRON_DOWN" />
      </div>
      <DisclosurePanel
        class="mt-2 border-t border-section-div py-2 focus-within:border-0"
      >
        <p class="select-text text-left text-distinct-text">
          {{ disclaimer }}
        </p>
      </DisclosurePanel>
    </DisclosureButton>
  </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { IconMap } from "~/types/icon-map";

defineProps<{
  disclaimer: string;
}>();
</script>

<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase class="rounded-md">
    <div class="space-y-2">
      <!-- <BtnAction
        @keydown="handleTabPress(false, $event)"
        class="flex max-h-[40px] w-full"
        :cta="true"
        label="i18n._global.support"
        leftIcon="IconSupport"
        fontSize="lg"
        ariaLabel="i18n._global.support_organization_aria_label"
      /> -->
      <!-- <BtnRouteInternal
        class="flex max-h-[40px] w-full"
        :cta="true"
        label="i18n.components.tooltip.menu_search_result._global.join"
        leftIcon="IconJoin"
        linkTo="/"
        fontSize="lg"
        ariaLabel="i18n._global.join_organization_aria_label"
      /> -->
      <BtnAction
        v-if="organization"
        @click="openModal()"
        @keydown.enter="openModal()"
        @keydown="handleTabPress(true, $event)"
        class="flex max-h-[40px] w-full items-center"
        :cta="true"
        label="i18n._global.share"
        :leftIcon="IconMap.SHARE"
        fontSize="lg"
        ariaLabel="i18n._global.share_organization_aria_label"
      />
      <ModalSharePage
        v-if="organization"
        @closeModal="handleCloseModal"
        :cta="true"
        :organization="organization"
        :isOpen="modalIsOpen"
      />
    </div>
  </TooltipBase>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/communities/organization";

import { IconMap } from "~/types/icon-map";

defineProps<{
  organization?: Organization;
}>();

const emit = defineEmits(["tab"]);
const { handleTabPress } = useTabNavigationEmit(emit);

const modals = useModals();
const modalName = "ModalSharePage";
const modalIsOpen = ref(false);

function openModal() {
  modals.openModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
}

const handleCloseModal = () => {
  modals.closeModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
};
</script>

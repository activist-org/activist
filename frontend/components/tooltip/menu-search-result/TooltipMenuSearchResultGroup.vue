<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase class="rounded-md">
    <div class="space-y-2">
      <!-- <BtnAction
        @keydown="handleTabPress(false, $event)"
        class="flex max-h-[40px] w-full"
        :cta="true"
        :label="i18nMap._global.support"
        leftIcon="IconSupport"
        fontSize="lg"
        :ariaLabel="$t(i18nMap._global.support_organization_aria_label)"
      /> -->
      <!-- <BtnRouteInternal
        class="flex max-h-[40px] w-full"
        :cta="true"
        :label="i18nMap.components._global.join"
        leftIcon="IconJoin"
        linkTo="/"
        fontSize="lg"
        :ariaLabel="
          $t(i18nMap._global.join_organization_aria_label)
        "
      /> -->
      <BtnAction
        v-if="group"
        @click="openModal()"
        @keydown.enter="openModal()"
        @keydown="handleTabPress(true, $event)"
        class="flex max-h-[40px] w-full items-center"
        :cta="true"
        :label="i18nMap._global.share"
        :rightIcon="IconMap.SHARE"
        fontSize="lg"
        :ariaLabel="$t(i18nMap._global.share_organization_aria_label)"
      />
      <ModalSharePage
        v-if="group"
        @closeModal="handleCloseModal"
        :cta="true"
        :group="group"
        :isOpen="modalIsOpen"
      />
    </div>
  </TooltipBase>
</template>

<script setup lang="ts">
import type { Group } from "~/types/communities/group";
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";

defineProps<{
  group?: Group;
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

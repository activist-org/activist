<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardGetInvolved>
    <div class="flex items-center gap-5">
      <h3 class="responsive-h3 text-left font-display">
        {{ $t(i18nMap.components._global.get_involved) }}
      </h3>
      <IconEdit @click="openModal()" @keydown.enter="openModal()" />
      <ModalEditTextGroup
        v-if="group"
        @closeModal="handleCloseModal"
        :group="group"
        :name="group.name"
        :sectionsToEdit="[
          $t(i18nMap._global.about),
          $t(i18nMap.components._global.get_involved),
          $t(i18nMap.components._global.join_group_link),
        ]"
        :isOpen="modalIsOpen"
      />
      <div class="flex space-x-2 pt-2 lg:absolute lg:right-0 lg:pt-0">
        <BtnRouteInternal
          v-if="group.getInvolvedUrl"
          :cta="true"
          :linkTo="group.getInvolvedUrl"
          label="_global.join_group"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="_global.join_group_aria_label"
        />
      </div>
    </div>
    <div class="space-y-3 pt-3">
      <p>
        {{
          $t(i18nMap.components._global.join_group_subtext, {
            org_name: group.name,
          })
        }}.
      </p>
    </div>
  </CardGetInvolved>
</template>

<script setup lang="ts">
import type { Group } from "~/types/communities/group";
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";

defineProps<{
  group: Group;
  disclaimer?: string;
}>();

const modals = useModals();
const modalName = "ModalEditTextGroup";
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

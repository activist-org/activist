<template>
  <CardGetInvolved>
    <div class="flex items-center gap-5">
      <h3 class="responsive-h3 text-left font-display">
        {{ $t("components._global.get_involved") }}
      </h3>
      <IconEdit @click="openModal()" @keydown.enter="openModal()" />
      <ModalEditAboutGroup
        v-if="group"
        @closeModal="handleCloseModal"
        :group="group"
        :name="group.name"
        :sectionsToEdit="[
          $t('_global.about'),
          $t('components._global.get_involved'),
          $t('components._global.join_group_link'),
        ]"
        :isOpen="modalIsOpen"
      />
      <div class="flex space-x-2 pt-2 lg:absolute lg:right-0 lg:pt-0">
        <BtnRouteInternal
          v-if="group.getInvolvedURL"
          :cta="true"
          :linkTo="group.getInvolvedURL"
          label="components.btn_route_internal.join_group"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="components.btn_route_internal.join_group_aria_label"
        />
      </div>
    </div>
    <div class="space-y-3 pt-3">
      <p>
        {{
          $t("components.card_get_involved.join_group_subtext", {
            org_name: group.name,
          })
        }}.
      </p>
    </div>
  </CardGetInvolved>
</template>

<script setup lang="ts">
import type { Group } from "~/types/entities/group";
import { IconMap } from "~/types/icon-map";

defineProps<{
  group: Group;
  disclaimer?: string;
}>();

const modals = useModals();
const modalName = "ModalEditAboutGroup";
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

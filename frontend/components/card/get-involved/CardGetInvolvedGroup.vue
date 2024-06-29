<template>
  <CardGetInvolved>
    <div class="flex items-center gap-5">
      <h3 class="responsive-h3 text-left font-display">
        {{ $t("components._global.get-involved") }}
      </h3>
      <IconEdit @click="openModal()" @keydown.enter="openModal()" />
      <ModalEditAboutGroup
        v-if="group"
        @closeModal="handleCloseModal"
        :group="group"
        :name="group.name"
        :sectionsToEdit="[
          $t('_global.about'),
          $t('components._global.get-involved'),
          $t('components._global.join-group-link'),
        ]"
        :isOpen="modalIsOpen"
      />
      <div class="flex space-x-2 pt-2 lg:absolute lg:right-0 lg:pt-0">
        <BtnRouteInternal
          v-if="group.getInvolvedURL"
          :cta="true"
          :linkTo="group.getInvolvedURL"
          label="components.btn-route-internal.join-group"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="components.btn-route-internal.join-group-aria-label"
        />
      </div>
    </div>
    <div class="space-y-3 pt-3">
      <p>
        {{
          $t("components.card-get-involved.join-group-subtext", {
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

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>

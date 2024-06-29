<template>
  <TooltipBase class="rounded-md">
    <div class="space-y-2">
      <!-- <BtnAction
        @keydown="handleTabPress(false, $event)"
        class="flex max-h-[40px] w-full"
        :cta="true"
        label="components.btn-action.support"
        leftIcon="IconSupport"
        fontSize="lg"
        :ariaLabel="$t('components.btn-action.support-organization-aria-label')"
      /> -->
      <!-- <BtnRouteInternal
        class="flex max-h-[40px] w-full"
        :cta="true"
        label="components._global.join"
        leftIcon="IconJoin"
        linkTo="/"
        fontSize="lg"
        :ariaLabel="
          $t('components.btn-route-internal.join-organization-aria-label')
        "
      /> -->
      <BtnAction
        v-if="group"
        @click="openModal()"
        @keydown.enter="openModal()"
        @keydown="handleTabPress(true, $event)"
        class="flex max-h-[40px] w-full items-center"
        :cta="true"
        label="components.btn-action.share"
        :leftIcon="IconMap.SHARE"
        fontSize="lg"
        :ariaLabel="$t('components._global.share-organization-aria-label')"
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
import type { Group } from "~/types/entities/group";
import { IconMap } from "~/types/icon-map";

defineProps<{
  group?: Group;
}>();

const emit = defineEmits(["tab"]);
const { handleTabPress } = useTabNavigationEmit(emit);

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>

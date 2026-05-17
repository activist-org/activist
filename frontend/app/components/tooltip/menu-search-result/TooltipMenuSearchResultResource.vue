<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase class="rounded-md" data-testid="menu-tooltip">
    <div class="space-y-2">
      <!-- <BtnAction
        @keydown="handleTabPress(false, $event)"
        class="flex max-h-10 w-full"
        :cta="true"
        label="i18n.components._global.star"
        :leftIcon="IconMap.STAR"
        fontSize="lg"
        ariaLabel="i18n.components._global.star"
      /> -->
      <BtnAction
        @click="openModalSharePage({ resource: resource })"
        @keydown="handleTabPress(true, $event)"
        @keydown.enter="openModalSharePage({ resource: resource })"
        ariaLabel="i18n._global.share"
        class="flex max-h-10 w-full items-center"
        :cta="true"
        fontSize="lg"
        label="i18n._global.share"
        :rightIcon="IconMap.SHARE"
      />
    </div>
  </TooltipBase>
</template>

<script setup lang="ts">
defineProps<{
  resource: Resource;
}>();

const emit = defineEmits(["tab"]);
const { handleTabPress } = useTabNavigationEmit(emit);

const { openModal: openModalSharePage } = useModalHandlers("ModalSharePage");
</script>

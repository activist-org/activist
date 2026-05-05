<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase class="rounded-md" data-testid="menu-tooltip">
    <div class="space-y-2">
      <!-- <BtnAction
        @keydown="handleTabPress(false, $event)"
        class="flex max-h-10 w-full"
        :cta="true"
        label="i18n._global.support"
        leftIcon="IconSupport"
        fontSize="lg"
        ariaLabel="i18n._global.support_organization_aria_label"
      /> -->
      <!-- <BtnRouteInternal
        class="flex max-h-10 w-full"
        :cta="true"
        label="i18n.components.tooltip.menu_search_result._global.join"
        leftIcon="IconJoin"
        linkTo="/"
        fontSize="lg"
        ariaLabel="i18n._global.join_organization_aria_label"
      /> -->
      <BtnAction
        v-if="organization"
        @click="openModalSharePage({ organization: organization })"
        @keydown="handleTabPress(true, $event)"
        @keydown.enter="openModalSharePage({ organization: organization })"
        ariaLabel="i18n._global.share_organization_aria_label"
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
  organization?: Organization;
}>();

const emit = defineEmits(["tab"]);
const { handleTabPress } = useTabNavigationEmit(emit);

const { openModal: openModalSharePage } = useModalHandlers("ModalSharePage");
</script>

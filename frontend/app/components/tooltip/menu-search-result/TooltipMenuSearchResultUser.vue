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
        ariaLabel="i18n.components.tooltip_menu_search_result_user.support_user_aria_label"
      /> -->
      <BtnAction
        @click="openModalSharePage({ user: user })"
        @keydown="handleTabPress(true, $event)"
        @keydown.enter="openModalSharePage({ user: user })"
        :ariaLabel="
          $t(
            'i18n.components.tooltip_menu_search_result_user.share_user_aria_label'
          )
        "
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
  user: UserActivist;
}>();

const emit = defineEmits(["tab"]);
const { handleTabPress } = useTabNavigationEmit(emit);

const { openModal: openModalSharePage } = useModalHandlers("ModalSharePage");
</script>

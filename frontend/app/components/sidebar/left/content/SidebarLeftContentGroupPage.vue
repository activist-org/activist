<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col items-center">
    <div
      class="relative"
      :class="{
        'h-32 w-32':
          sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'h-10 w-10':
          sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <ImageGroup
        :alt="
          $t('i18n._global.entity_logo', {
            entity_name: name,
          })
        "
        class="elem-shadow-sm"
        eventType="action"
      />
      <button
        v-if="
          showButton &&
          (sidebar.collapsed == false || sidebar.collapsedSwitch == false)
        "
        @click="showToastError('THIS FEATURE IS COMING SOON!')"
        :aria-label="
          $t('i18n.components.sidebar_left_content_group_page.edit_aria_label')
        "
        class="absolute bottom-1 right-1 z-10 flex rounded-md border border-black/80 bg-white/80 p-1 text-black/80 focus-brand dark:border-white/80 dark:bg-black/80 dark:text-white/80"
      >
        <Icon :name="IconMap.EDIT" size="1em" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
const { showToastError } = useToaster();
const props = defineProps<{
  name: string;
  logoUrl?: string;
}>();

const { name } = toRefs(props);

const sidebar = useSidebar();
// const { openModal: openModalUploadImage } = useModalHandlers(
//   "ModalUploadImageIcon"
// );

const showButton = true;
</script>

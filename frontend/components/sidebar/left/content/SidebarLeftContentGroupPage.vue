<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="elem-shadow-sm mx-1 rounded-md bg-layer-2 pb-1 pt-2 text-primary-text transition-all duration-500"
  >
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
          class="elem-shadow-sm"
          eventType="action"
          :alt="
            $t('i18n._global.entity_logo', {
              entity_name: name,
            })
          "
        />
        <button
          v-if="
            showButton &&
            (sidebar.collapsed == false || sidebar.collapsedSwitch == false)
          "
          @click="
            openModalUploadImages({
              fileUploadEntity: FileUploadEntity.GROUP_ICON,
            })
          "
          class="focus-brand absolute bottom-1 right-1 z-10 flex rounded-md border border-black/80 bg-white/80 p-1 text-black/80 dark:border-white/80 dark:bg-black/80 dark:text-white/80"
          ariaLabel="i18n.components.sidebar_left_content_group_page.edit_aria_label"
        >
          <Icon :name="IconMap.EDIT" size="1em" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileUploadEntity } from "~/types/content/file-upload-entity";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  name: string;
  logoUrl?: string;
}>();

const { name } = toRefs(props);

const sidebar = useSidebar();
const { openModal: openModalUploadImages } =
  useModalHandlers("ModalUploadImages");

const showButton = true;
</script>

<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="elem-shadow-sm mx-1 rounded-md bg-layer-2 pb-1 pt-2 text-primary-text transition-all duration-500"
  >
    <div class="flex flex-col items-center">
      <div
        v-if="sidebarTypeToDisplay === SidebarType.ORGANIZATION_PAGE"
        class="flex flex-col items-center"
        :class="{
          'h-40 w-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'h-10 w-10':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <ImageOrganization
          class="elem-shadow-sm"
          :imgUrl="logoUrl"
          :alt="
            $t('i18n._global.entity_logo', {
              entity_name: name,
            })
          "
        />
        <BtnAction
          v-if="
            showButton &&
            (sidebar.collapsed == false || sidebar.collapsedSwitch == false)
          "
          @click="
            openModalUploadImages({
              fileUploadEntity: FileUploadEntity.ORGANIZATION_ICON,
            })
          "
          class="-mb-2 mt-2"
          :cta="true"
          label="i18n.components._global.upload"
          fontSize="xs"
          :leftIcon="IconMap.PLUS"
          iconSize="1.25em"
          ariaLabel="i18n.components.sidebar_left_index.upload_aria_label"
        />
      </div>
      <div
        v-else-if="sidebarTypeToDisplay === SidebarType.EVENT_PAGE"
        class="flex flex-col items-center"
        :class="{
          'h-40 w-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'h-10 w-10':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <ImageEvent
          class="elem-shadow-sm"
          eventType="action"
          :imgUrl="logoUrl"
          :alt="
            $t('i18n._global.entity_logo', {
              entity_name: name,
            })
          "
        />
        <BtnAction
          v-if="
            showButton &&
            (sidebar.collapsed == false || sidebar.collapsedSwitch == false)
          "
          @click="
            openModalUploadImages({
              fileUploadEntity: FileUploadEntity.EVENT_ICON,
            })
          "
          class="-mb-2 mt-2"
          :cta="true"
          label="i18n.components._global.upload"
          fontSize="xs"
          :leftIcon="IconMap.PLUS"
          iconSize="1.25em"
          ariaLabel="i18n.components.sidebar_left_index.upload_aria_label"
        />
      </div>
      <div
        v-else-if="sidebarTypeToDisplay === SidebarType.GROUP_PAGE"
        class="flex flex-col items-center"
        :class="{
          'h-40 w-32':
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
        <BtnAction
          v-if="
            showButton &&
            (sidebar.collapsed == false || sidebar.collapsedSwitch == false)
          "
          @click="
            openModalUploadImages({
              fileUploadEntity: FileUploadEntity.GROUP_ICON,
            })
          "
          class="-mb-2 mt-2"
          :cta="true"
          label="i18n.components._global.upload"
          fontSize="xs"
          :leftIcon="IconMap.PLUS"
          iconSize="1.25em"
          ariaLabel="i18n.components.sidebar_left_index.upload_aria_label"
        />
      </div>
      <ul
        id="submenu"
        class="mb-1 flex w-full flex-col px-1"
        :class="{
          'mt-4':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'mt-2': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <li
          v-for="menuEntry in sidebarTypeToDisplay ===
          SidebarType.ORGANIZATION_PAGE
            ? menuEntriesState.organizationEntry.value
            : menuEntriesState.eventEntry.value"
        >
          <SidebarLeftSelector
            :id="
              (sidebarType === SidebarType.ORGANIZATION_PAGE
                ? 'org-'
                : 'event-') + menuEntry.label.split('.').pop()
            "
            :label="menuEntry.label"
            :routeUrl="menuEntry.routeUrl"
            :iconUrl="menuEntry.iconUrl"
            :selected="menuEntry.selected"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileUploadEntity } from "~/types/content/file-upload-entity";
import { IconMap } from "~/types/icon-map";
import { SidebarType } from "~/types/sidebar-type";

const props = defineProps<{
  name: string;
  sidebarType:
    | SidebarType.ORGANIZATION_PAGE
    | SidebarType.EVENT_PAGE
    | SidebarType.GROUP_PAGE;
  logoUrl?: string;
}>();

const logoUrl = ref(props.logoUrl);

const sidebarTypeToDisplay = computed(() => props.sidebarType);

const sidebar = useSidebar();
const menuEntriesState = useMenuEntriesState();

const { openModal: openModalUploadImages } =
  useModalHandlers("ModalUploadImages");

const showButton = true;
</script>

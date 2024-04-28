<template>
  <div
    class="elem-shadow-sm mx-1 rounded-md bg-light-layer-2 py-2 text-light-text transition-all duration-500 dark:bg-dark-layer-2 dark:text-dark-text"
  >
    <div class="flex flex-col items-center">
      <div
        v-if="sidebarType === SidebarType.ORGANIZATION_PAGE"
        class="relative"
        :class="{
          'h-32 w-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'h-10 w-10':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <button
          v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
          @click="openModal()"
          class="focus-brand absolute bottom-1 right-1 z-10 flex rounded-md border border-black/80 bg-white/80 p-[0.125em] text-black/80 dark:border-white/80 dark:bg-black/80 dark:text-white/80"
        >
          <Icon name="bi:plus-lg" size="1em" />
        </button>
        <ModalUploadImages
          @closeModal="handleCloseModal"
          :isOpen="modalIsOpen"
          :uploadLimit="1"
        />
        <ImageOrganization
          class="elem-shadow-sm"
          :imgURL="logoUrl"
          :alt="
            $t('components._global.entity-logo', {
              entity_name: name,
            })
          "
        />
      </div>
      <div
        v-else-if="sidebarType === SidebarType.EVENT_PAGE"
        class="relative"
        :class="{
          'h-32 w-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'h-10 w-10':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <button
          v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
          @click="openModal()"
          class="focus-brand absolute bottom-1 right-1 z-10 flex rounded-md border border-black/80 bg-white/80 p-[0.125em] text-black/80 dark:border-white/80 dark:bg-black/80 dark:text-white/80"
        >
          <Icon name="bi:plus-lg" size="1em" />
        </button>
        <ModalUploadImages
          @closeModal="handleCloseModal"
          :isOpen="modalIsOpen"
          :uploadLimit="1"
        />
        <ImageEvent
          class="elem-shadow-sm"
          eventType="action"
          :alt="
            $t('components._global.entity-logo', {
              entity_name: name,
            })
          "
        />
      </div>
      <ul
        class="mb-1 flex w-full flex-col px-1"
        :class="{
          'mt-4':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'mt-2': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <li
          v-for="menuEntry in sidebarType === SidebarType.ORGANIZATION_PAGE
            ? menuEntriesState.organizationEntry.value
            : menuEntriesState.eventEntry.value"
        >
          <SidebarLeftSelector
            :label="menuEntry.label"
            :routeURL="menuEntry.routeURL"
            :iconURL="menuEntry.iconURL"
            :selected="menuEntry.selected"
            :active="menuEntry.active"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SidebarType } from "~/types/sidebar-type";

defineProps<{
  name: string;
  sidebarType: SidebarType.ORGANIZATION_PAGE | SidebarType.EVENT_PAGE;
  logoUrl?: string;
}>();

const sidebar = useSidebar();
const menuEntriesState = useMenuEntriesState();

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>

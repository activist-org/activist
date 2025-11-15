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
      <ImageOrganization
        :alt="
          $t('i18n._global.entity_logo', {
            entity_name: name,
          })
        "
        class="elem-shadow-sm"
        :imgUrl="
          organization?.iconUrl?.fileObject
            ? `${BASE_BACKEND_URL_NO_V1}${organization?.iconUrl?.fileObject}`
            : logoUrl
        "
      />
      <!-- Change this button to use a button component not make one here. -->
      <IconEdit
        v-if="
          showButton &&
          (sidebar.collapsed == false || sidebar.collapsedSwitch == false)
        "
        @click="openModal()"
        :aria-label="
          $t(
            'i18n.components.sidebar_left_content_organization.edit_aria_label'
          )
        "
        class="absolute bottom-1 right-1 z-10 flex rounded-md border border-black/80 bg-white/80 p-1 text-black/80 focus-brand dark:border-white/80 dark:bg-black/80 dark:text-white/80"
      />
    </div>
    <ul
      id="submenu"
      class="mb-1 flex w-full flex-col px-1"
      :class="{
        'mt-4': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'mt-2': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <li v-for="menuEntry in menuEntriesState.organizationEntry.value">
        <SidebarLeftSelector
          :id="'org-' + menuEntry.label.split('.').pop()"
          :iconUrl="menuEntry.iconUrl"
          :label="menuEntry.label"
          :routeUrl="menuEntry.routeUrl"
          :selected="menuEntry.selected"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  name: string;
  logoUrl?: string;
}>();

const logoUrl = ref(props.logoUrl);

const { openModal } = useModalHandlers("ModalUploadImageIcon");
const { BASE_BACKEND_URL_NO_V1 } = useGetBaseURLs();
const sidebar = useSidebar();
const menuEntriesState = useMenuEntriesState();

const { data: organization } = useGetOrganization(
  (useRoute().params.orgId as string) ?? ""
);

const showButton = true;
</script>

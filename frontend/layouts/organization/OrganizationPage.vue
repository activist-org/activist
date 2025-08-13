<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLayout name="app">
    <ModalUploadImage
      @upload-complete="fetchOrganizationImages()"
      @closeModal="handleCloseModalUploadImage"
      :entityId="organization.id || ''"
      :entityType="EntityType.ORGANIZATION"
    />
    <ModalUploadImageIcon
      @upload-complete="organizationStore.fetchById(organization.id)"
      @closeModal="handleCloseModalUploadImageIcon"
      :entityId="organization.id || ''"
      :entityType="EntityType.ORGANIZATION"
    />
    <SidebarLeft
      v-if="aboveMediumBP"
      @mouseover="sidebarHover = true"
      @focus="sidebarHover = true"
      @mouseleave="sidebarHover = false"
      @blur="sidebarHover = false"
      class="block"
    />
    <div class="flex flex-col md:h-screen md:overflow-y-scroll">
      <div
        class="bg-layer-0 pt-8 transition-padding duration-500 md:pt-0"
        :class="sidebarContentDynamicClass"
      >
        <NuxtPage :organization="organization" />
      </div>
      <FooterWebsite
        class="pb-24 transition-padding duration-500 md:pb-12"
        :class="sidebarFooterDynamicClass"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { EntityType } from "~/types/entity";
import {
  getSidebarContentDynamicClass,
  getSidebarFooterDynamicClass,
} from "~/utils/sidebarUtils";

const { handleCloseModal: handleCloseModalUploadImage } =
  useModalHandlers("ModalUploadImage");
const { handleCloseModal: handleCloseModalUploadImageIcon } = useModalHandlers(
  "ModalUploadImageIcon"
);
const organizationStore = useOrganizationStore();
const { organization } = organizationStore;
const { fetchOrganizationImages } = useFileManager(organization.id);
watch(
  () => organization.id,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      const { fetchOrganizationImages } = useFileManager(organization.id);
      await fetchOrganizationImages();
    }
  }
);
const aboveMediumBP = useBreakpoint("md");

const sidebarHover = ref(false);
const sidebarContentScrollable = useState<boolean>("sidebarContentScrollable");
const sidebarContentDynamicClass = getSidebarContentDynamicClass(
  sidebarContentScrollable.value,
  sidebarHover
);

const sidebarFooterDynamicClass = getSidebarFooterDynamicClass(sidebarHover);
</script>

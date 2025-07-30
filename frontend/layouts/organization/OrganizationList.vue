<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLayout name="app">
    <!-- <ModalUploadImages
      @closeModal="handleCloseModalUploadImages"
      @upload-complete="handleUploadComplete"
    /> -->
    <ModalUploadImages @upload-complete="handleUploadComplete" />
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
        <NuxtPage :organizations="organizations" />
      </div>
      <FooterWebsite
        class="pb-24 transition-padding duration-500 md:pb-12"
        :class="sidebarFooterDynamicClass"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { FileUploadEntity } from "~/types/content/file-upload-entity";
import {
  getSidebarContentDynamicClass,
  getSidebarFooterDynamicClass,
} from "~/utils/sidebarUtils";

const organizationStore = useOrganizationStore();
await organizationStore.fetchAll();
const { organizations } = organizationStore;

const handleUploadComplete = async (fileUploadEntity: FileUploadEntity) => {
  if (fileUploadEntity === FileUploadEntity.ORGANIZATION_CAROUSEL) {
    const { fetchOrganizationImages } = useFileManager(
      organizationStore.organization.id
    );
    await fetchOrganizationImages();
  }
  if (fileUploadEntity === FileUploadEntity.ORGANIZATION_ICON) {
    // For future implementation
  }
};

const aboveMediumBP = useBreakpoint("md");

const sidebarHover = ref(false);
const sidebarContentScrollable = useState<boolean>("sidebarContentScrollable");

const sidebarContentDynamicClass = getSidebarContentDynamicClass(
  sidebarContentScrollable.value,
  sidebarHover
);

const sidebarFooterDynamicClass = getSidebarFooterDynamicClass(sidebarHover);
</script>

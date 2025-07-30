<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLayout name="app">
    <ModalUploadImages
      @closeModal="handleCloseModalUploadImages"
      @upload-complete="handleUploadComplete"
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
        <NuxtPage :group="group" />
      </div>
      <FooterWebsite
        class="pb-24 transition-padding duration-500 md:pb-12"
        :class="sidebarFooterDynamicClass"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {
  getSidebarContentDynamicClass,
  getSidebarFooterDynamicClass,
} from "~/utils/sidebarUtils";

const paramsGroupId = useRoute().params.groupid;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;

const groupStore = useGroupStore();
await groupStore.fetchById(groupId);
const { group } = groupStore;

const { handleCloseModal: handleCloseModalUploadImages } =
  useModalHandlers("ModalUploadImages");

const handleUploadComplete = () => {
  // For future implementation
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

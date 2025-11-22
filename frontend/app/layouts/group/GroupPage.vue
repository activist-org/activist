<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLayout name="app">
    <ModalUploadImageGroup
      @closeModal="handleCloseModalUploadImage"
      @upload-complete="handleUploadComplete"
      :groupId="group?.id || ''"
      :images="images || []"
    />
    <ModalUploadImageIcon
      @closeModal="handleCloseModalUploadImageIcon"
      :entityId="group?.id || ''"
      :entityType="EntityType.GROUP"
    />
    <SidebarLeft
      v-if="aboveMediumBP"
      @blur="sidebarHover = false"
      @focus="sidebarHover = true"
      @mouseleave="sidebarHover = false"
      @mouseover="sidebarHover = true"
      class="block"
    />
    <div class="flex flex-col md:h-screen md:overflow-y-scroll">
      <div
        v-if="group && images"
        class="bg-layer-0 pt-8 transition-[padding] duration-500 md:pt-0"
        :class="sidebarContentDynamicClass"
      >
        <NuxtPage />
      </div>
      <FooterWebsite
        class="pb-24 transition-[padding] duration-500 md:pb-12"
        :class="sidebarFooterDynamicClass"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const aboveMediumBP = useBreakpoint("md");

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;
const { data: group } = useGetGroup(groupId ?? "");
const { data: images } = useGetGroupImages(groupId ?? "");

const { handleCloseModal: handleCloseModalUploadImage } = useModalHandlers(
  "ModalUploadImageGroup"
);
const { handleCloseModal: handleCloseModalUploadImageIcon } = useModalHandlers(
  "ModalUploadImageIcon"
);

const handleUploadComplete = () => {
  // Note: For future implementation.
};

const sidebarHover = ref(false);
const sidebarContentScrollable = useState<boolean>("sidebarContentScrollable");
const { getSidebarContentDynamicClass, getSidebarFooterDynamicClass } =
  useSidebarClass();
const sidebarContentDynamicClass = getSidebarContentDynamicClass(
  sidebarContentScrollable.value,
  sidebarHover
);

const sidebarFooterDynamicClass = getSidebarFooterDynamicClass(sidebarHover);
</script>

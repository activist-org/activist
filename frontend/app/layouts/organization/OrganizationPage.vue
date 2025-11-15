<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLayout name="app">
    <ModalUploadImageOrganization
      @closeModal="handleCloseModalUploadImage"
      :images="images || []"
      :orgId="organization?.id || ''"
    />
    <ModalUploadImageIcon
      @closeModal="handleCloseModalUploadImageIcon"
      :entityId="organization?.id || ''"
      :entityType="EntityType.ORGANIZATION"
    />
    <SidebarLeft
      v-if="aboveMediumBP"
      @blur="sidebarHover = false"
      @focus="sidebarHover = true"
      @mouseleave="sidebarHover = false"
      @mouseover="sidebarHover = true"
      class="fixed top-0 z-20 h-screen"
    />
    <div class="flex flex-col">
      <div
        class="bg-layer-0 pt-8 transition-[padding] duration-500 md:pt-0"
        :class="sidebarContentDynamicClass"
      >
        <NuxtPage :organization="organization" />
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

const { handleCloseModal: handleCloseModalUploadImage } = useModalHandlers(
  "ModalUploadImageOrganization"
);
const { handleCloseModal: handleCloseModalUploadImageIcon } = useModalHandlers(
  "ModalUploadImageIcon"
);

const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;

const { data: organization } = useGetOrganization(orgId || "");
const { data: images } = useGetOrganizationImages(orgId || "");

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

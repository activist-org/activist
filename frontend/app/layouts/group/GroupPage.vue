<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLayout name="app">
    <SidebarLeft
      v-if="aboveMediumBP"
      @blur="sidebarHover = false"
      @focus="sidebarHover = true"
      @mouseleave="sidebarHover = false"
      @mouseover="sidebarHover = true"
      class="block"
    />
    <div
      class="flex grid-rows-none flex-col overflow-x-hidden md:grid md:h-screen md:grid-rows-[1fr_auto] md:overflow-y-hidden"
    >
      <div
        v-if="group && images"
        class="bg-layer-0 pt-8 transition-[padding] duration-500 md:pt-0"
        :class="sidebarContentDynamicClass"
      >
        <EntityIconMobile
          v-if="showMobileEntityShortcut"
          @edit="handleEditGroupIcon"
          :entity="group"
          :icon="IconMap.GROUP"
          :imgUrl="groupIconUrl"
          :tagline="group?.tagline"
        />
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

const groupIconUrl = computed(() =>
  group.value?.iconUrl?.fileObject
    ? `/api/${group.value.iconUrl.fileObject}`
    : ""
);
const showMobileEntityShortcut = computed(
  () => !aboveMediumBP.value && !!group.value
);

const sidebarHover = ref(false);
const sidebarContentScrollable = useState<boolean>("sidebarContentScrollable");
const { getSidebarContentDynamicClass, getSidebarFooterDynamicClass } =
  useSidebarClass();
const sidebarContentDynamicClass = getSidebarContentDynamicClass(
  sidebarContentScrollable.value,
  sidebarHover
);

const sidebarFooterDynamicClass = getSidebarFooterDynamicClass(sidebarHover);
const { showToastError } = useToaster();

function handleEditGroupIcon(): void {
  showToastError("THIS FEATURE IS COMING SOON!");
}
</script>

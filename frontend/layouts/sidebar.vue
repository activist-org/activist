<template>
  <HeaderMobile />
  <MenuMobileNavigationDropdown v-if="windowWidth < BreakpointMap.MEDIUM" />
  <SidebarLeft
    v-if="windowWidth >= BreakpointMap.MEDIUM"
    @mouseover="sidebarHover = true"
    @focus="sidebarHover = true"
    @mouseleave="sidebarHover = false"
    @blur="sidebarHover = false"
  />
  <div class="flex flex-col md:h-screen md:overflow-y-scroll">
    <div
      class="bg-light-layer-0 pt-8 transition-padding duration-500 dark:bg-dark-layer-0 md:pt-0"
      :class="sidebarContentDynamicClass"
    >
      <NuxtPage />
    </div>
    <FooterWebsite
      class="pb-24 transition-padding duration-500 md:pb-12"
      :class="sidebarFooterDynamicClass"
    />
  </div>
  <MenuMobileNavBar v-if="windowWidth < BreakpointMap.MEDIUM" />
</template>

<script setup lang="ts">
import {
  getSidebarContentDynamicClass,
  getSidebarFooterDynamicClass,
} from "~/utils/sidebarUtils";
import { BreakpointMap } from "~/types/breakpoint-map";

const sidebar = useSidebar();
const sidebarHover = ref(false);

onMounted(() => {
  window.addEventListener("resize", handleWindowSizeChange);
  handleWindowSizeChange();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleWindowSizeChange);
});

const windowWidth = ref(window.innerWidth);

const handleWindowSizeChange = () => {
  windowWidth.value = window.innerWidth;
  if (window.innerWidth < 1280) {
    sidebar.collapsed = true;
    sidebar.collapsedSwitch = true;
  }
};

const sidebarContentScrollable = useState<boolean>("sidebarContentScrollable");

const sidebarContentDynamicClass = getSidebarContentDynamicClass(
  sidebarContentScrollable.value,
  sidebarHover
);

const sidebarFooterDynamicClass = getSidebarFooterDynamicClass(sidebarHover);
</script>

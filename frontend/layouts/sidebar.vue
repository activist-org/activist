<template>
  <HeaderMobile />
  <MenuMobileNavigationDropdown v-if="!aboveMediumBP" />
  <SidebarLeft v-if="aboveMediumBP"
               @mouseover="sidebarHover = true"
               @focus="sidebarHover = true"
               @mouseleave="sidebarHover = false"
               @blur="sidebarHover = false"
               class="block" />



  <div class="flex flex-col md:h-screen md:overflow-y-scroll">
    <div class="bg-light-layer-0 pt-8 transition-padding duration-500 dark:bg-dark-layer-0 md:pt-0"
         :class="sidebarContentDynamicClass">
      <NuxtPage />
    </div>
    <FooterWebsite class="pb-24 transition-padding duration-500 md:pb-12"
                   :class="sidebarFooterDynamicClass" />
  </div>
  <MenuMobileNavBar v-if="!aboveMediumBP" />
</template>

<script setup lang="ts">
   
import useBreakpoint from "~/composables/useBreakpoint";
import {
  getSidebarContentDynamicClass,
  getSidebarFooterDynamicClass,
  } from "~/utils/sidebarUtils";
  


const aboveMediumBP = useBreakpoint("md");

const sidebar = useSidebar();
const sidebarHover = ref(false);

onMounted(() => {
  window.addEventListener("resize", handleWindowSizeChange);
  handleWindowSizeChange();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleWindowSizeChange);
});

const handleWindowSizeChange = () => {
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


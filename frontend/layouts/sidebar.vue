<template>
  <HeaderMobile />
  <MenuMobileNavigationDropdown class="md:hidden" />
  <SidebarLeft
    @mouseover="sidebarHover = true"
    @focus="sidebarHover = true"
    @mouseleave="sidebarHover = false"
    @blur="sidebarHover = false"
    class="hidden md:block"
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
  <MenuMobileNavBar class="md:hidden" />
</template>

<script setup lang="ts">
import {
  getSidebarContentDynamicClass,
  getSidebarFooterDynamicClass,
} from "~/utils/sidebarUtils";

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

const sidebarFooterDynamicClass = getSidebarFooterDynamicClass(
  sidebarHover.value
);

const sidebarContentDynamicClass = getSidebarContentDynamicClass(
  sidebarContentScrollable.value,
  sidebarHover.value
);
</script>

<template>
  <HeaderMobile />
  <MenuNavigationDropdown />
  <SidebarLeft
    @mouseover="sidebarHover = true"
    @focus="sidebarHover = true"
    @mouseleave="sidebarHover = false"
    @blur="sidebarHover = false"
  />
  <div class="flex flex-col md:h-screen md:overflow-y-scroll">
    <div
      class="bg-light-layer-0 pt-8 transition-padding duration-500 dark:bg-dark-layer-0 md:pt-0"
      :class="{
        'md:pl-16 xl:pl-56':
          sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'md:pl-16 xl:pl-16':
          sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        'blur-sm xl:blur-none':
          sidebar.collapsedSwitch == true &&
          sidebar.collapsed == false &&
          sidebarHover == true,
      }"
    >
      <slot />
    </div>
    <Footer
      class="pb-24 transition-padding duration-500 md:pb-12"
      :class="{
        'md:pl-24 xl:pl-64':
          sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'md:pl-24 xl:pl-24':
          sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        'blur-sm xl:blur-none':
          sidebar.collapsedSwitch == true &&
          sidebar.collapsed == false &&
          sidebarHover == true,
      }"
    />
  </div>
  <MenuMobileNavBar />
</template>

<script setup lang="ts">
const sidebar = useSidebar();
let sidebarHover: boolean;

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
</script>

<template>
  <MenuMobileHeader />
  <div class="flex flex-col md:h-screen md:overflow-y-scroll">
    <SidebarLeft />
    <div
      class="mt-12 bg-light-content dark:bg-dark-content md:mt-0"
      :class="{
        'md:pl-16 xl:pl-56':
          sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'md:pl-16 xl:pl-16':
          sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <slot />
    </div>
    <Footer
      class="pb-24 md:pb-12"
      :class="{
        'md:pl-24 xl:pl-64':
          sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'md:pl-24 xl:pl-24':
          sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    />
  </div>
  <MenuMobileNavBar />
</template>

<script setup lang="ts">
const sidebar = useSidebar();

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

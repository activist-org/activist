<template>
  <div class="flex lg:h-screen overflow-hidden">
    <MenuMobileHeader />
    <SidebarLeft />
    <div class="flex flex-col w-full lg:overflow-y-scroll">
      <div
        class="bg-light-content dark:bg-dark-content mt-12 lg:mt-0"
        :class="{
          'lg:pl-56':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'lg:pl-16':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <slot />
      </div>
      <Footer
        class="pb-24 lg:pb-12"
        :class="{
          'lg:pl-64':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'lg:pl-24':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      />
    </div>
    <MenuMobileNavBar />
  </div>
</template>

<script setup lang="ts">
const sidebar = useSidebar();
</script>

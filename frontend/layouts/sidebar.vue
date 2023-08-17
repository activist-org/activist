<template>
  <div class="flex overflow-hidden md:h-screen">
    <MenuMobileHeader />
    <SidebarLeft />
    <div class="flex flex-col w-full md:overflow-y-scroll">
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
          'md:pl-16 xl:pl-64':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'md:pl-16 xl:pl-24':
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

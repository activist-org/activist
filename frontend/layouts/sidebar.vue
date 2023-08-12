<template>
  <div class="flex h-screen overflow-hidden">
    <MenuMobileHeader />
    <SidebarLeft />
    <div class="flex flex-col w-full overflow-y-scroll">
      <div
        class="bg-light-content dark:bg-dark-content"
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
        :class="{
          'md:pl-24 xl:pl-64':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'md:pl-24 xl:pl-24':
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

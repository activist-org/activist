<template>
  <div class="flex h-screen overflow-hidden">
    <MenuMobileHeader />
    <SidebarLeft />
    <div class="flex flex-col w-full overflow-y-scroll">
      <div
        class="bg-light-content dark:bg-dark-content"
        :class="{
          'pl-2 sm:pl-24 md:pl-72':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'pl-2 sm:pl-24':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <slot />
      </div>
      <WebsiteFooter
        :class="{
          'md:pl-72':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'md:pl-24':
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

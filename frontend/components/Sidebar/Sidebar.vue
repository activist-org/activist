<template>
  <aside
    class="absolute flex-col h-full bg-light-distinct dark:bg-dark-distinct sm:flex transition-all duration-700"
    :class="{
      'w-48': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'w-16': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }"
    @mouseover="sidebar.collapsed = false"
    @mouseleave="sidebar.collapsed = true"
  >
    <SidebarHeader />
    <SearchBar class="mt-2" />
    <SidebarMainSectionSelectors class="mt-2" />
    <SidebarFooter />
  </aside>
</template>

<script setup lang="ts">
const sidebar = useSidebar();
</script>


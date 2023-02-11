<template>
  <aside
    class="absolute flex-col hidden h-full bg-light-distinct dark:bg-dark-distinct sm:flex"
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

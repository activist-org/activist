<template>
  <aside
    class="absolute flex-col h-full bg-light-distinct dark:bg-dark-distinct sm:flex transition-all duration-500"
    :class="{
      'w-48': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'w-16': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }"
    @mouseover="sidebar.collapsed = false"
    @mouseleave="sidebar.collapsed = true"
  >
    <SidebarHeader />
    <div>
      <SearchBar class="mt-2" />
      <SidebarMainSectionSelectors class="mt-2" />
      <MenuIndex
        :menuType="
          route.path.includes('organizations') ? 'organizations' : 'events'
        "
        :name="placeholderName"
        :logoUrl="placeholderLogo"
        class="mt-2"
      />
    </div>
    <SidebarFooter />
  </aside>
</template>

<script setup lang="ts">
const sidebar = useSidebar();
const route = useRoute();
defineProps<{
  name?: string;
}>();
// TODO use real name of organization / event when available from backend
const placeholderName = "tech from below";
const placeholderLogo = "~/assets/tech_from_below_logo.svg";
</script>

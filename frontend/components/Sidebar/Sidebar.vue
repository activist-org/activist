<template>
  <aside
    class="absolute z-10 flex-col h-full transition-all duration-500 border-r bg-light-distinct dark:bg-dark-distinct sm:flex border-light-section-div dark:border-dark-section-div"
    :class="{
      'w-48': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'w-16': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }"
    @mouseover="sidebar.collapsed = false"
    @mouseleave="sidebar.collapsed = true"
  >
    <SidebarHeader />
    <div class="overflow-x-hidden overflow-y-scroll">
      <SearchBar class="mt-2" />
      <SidebarMainSectionSelectors class="mt-2" />
      <MenuIndex
        :menuType="menuTypeToDisplay"
        :name="placeholderName"
        :logoUrl="placeholderLogo"
        class="mt-2"
      />
    </div>
    <SidebarFooter />
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  name?: string;
}>();

const sidebar = useSidebar();
const route = useRoute();

let menuTypeToDisplay = "";
if (route.path.includes("organizations")) {
  menuTypeToDisplay = "organization";
} else if (route.path.includes("events")) {
  menuTypeToDisplay = "event";
} else {
  menuTypeToDisplay = "misc"; // TODO: assign this based on other options
}

// TODO use real name of organization / event when available from backend.
const placeholderName = route.path.split("/").at(-2).replaceAll("-", " ");
const placeholderLogo = "/images/tech-from-below.svg";
</script>

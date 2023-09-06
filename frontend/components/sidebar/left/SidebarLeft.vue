<template>
  <aside
    class="absolute z-10 flex-col hidden h-full border-r transition-all duration-500 bg-light-distinct dark:bg-dark-distinct md:flex border-light-section-div dark:border-dark-section-div shadow-sm shadow-zinc-700"
    :class="{
      'w-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'w-16': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }"
    @mouseover="sidebar.collapsed = false"
    @mouseleave="sidebar.collapsed = true"
  >
    <SidebarLeftHeader />
    <div class="h-full overflow-x-hidden overflow-y-scroll">
      <SearchBar location="sidebar" class="mt-2" />
      <SidebarLeftMainSectionSelectors class="mt-2" />
      <SidebarLeftIndex
        class="my-3"
        :name="placeholderName"
        :pageType="pageTypeToDisplay"
        :logoUrl="placeholderLogo"
      />
    </div>
    <SidebarLeftFooter />
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  name?: string;
}>();

const sidebar = useSidebar();
const route = useRoute();

let pageTypeToDisplay = "";
if (route.path.includes("organizations")) {
  pageTypeToDisplay = "organization";
} else if (route.path.includes("events")) {
  pageTypeToDisplay = "event";
} else {
  pageTypeToDisplay = "misc"; // TODO: assign this based on other options
}

// TODO use real name of organization / event when available from backend.
const placeholderName = route.path.split("/").at(-2)?.replaceAll("-", " ");
const placeholderLogo = "/images/tech-from-below.svg";
</script>

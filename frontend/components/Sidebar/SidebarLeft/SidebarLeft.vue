<template>
  <aside
    class="hidden absolute z-10 flex-col h-full border-r transition-all duration-500 bg-light-distinct dark:bg-dark-distinct sm:flex border-light-section-div dark:border-dark-section-div"
    :class="{
      'w-48': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'w-16': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }"
    @mouseover="sidebar.collapsed = false"
    @mouseleave="sidebar.collapsed = true"
  >
    <SidebarLeftHeader />
    <div class="overflow-x-hidden overflow-y-scroll h-full">
      <SearchBar location="sidebar" class="mt-2" />
      <SidebarLeftMainSectionSelectors class="mt-2" />
      <SidebarLeftIndex
        :pageType="pageTypeToDisplay"
        :name="placeholderName"
        :logoUrl="placeholderLogo"
        class="mt-2"
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
const placeholderName = route.path.split("/").at(-2).replaceAll("-", " ");
const placeholderLogo = "/images/tech-from-below.svg";
</script>

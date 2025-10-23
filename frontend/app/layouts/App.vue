<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLoadingIndicator color="#F0A14C" />
  <HeaderMobile />
  <MenuMobileNavigationDropdown v-if="!aboveMediumBP" />
  <slot />
  <MenuMobileNavBar v-if="!aboveMediumBP" />
</template>

<script setup lang="ts">
const aboveMediumBP = useBreakpoint("md");

const sidebar = useSidebar();

onMounted(() => {
  window.addEventListener("resize", handleWindowSizeChange);
  handleWindowSizeChange();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleWindowSizeChange);
});

const handleWindowSizeChange = () => {
  if (window.innerWidth < 1280) {
    sidebar.collapsed = true;
    sidebar.collapsedSwitch = true;
  }
};
</script>

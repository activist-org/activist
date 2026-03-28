<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLoadingIndicator color="#F0A14C" />
  <HeaderMobile />
    <MenuMobileNavigationDropdown class="block md:hidden" />
  <slot />
    <MenuMobileNavBar class="block md:hidden" />
</template>

<script setup lang="ts">
const sidebar = useSidebar();

onMounted(() => {
  window.addEventListener("resize", handleWindowSizeChange);
  handleWindowSizeChange();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleWindowSizeChange);
});

const handleWindowSizeChange = () => {
  if (window?.innerWidth < 1280) {
    sidebar.collapsed = true;
    sidebar.collapsedSwitch = true;
  }
};
</script>

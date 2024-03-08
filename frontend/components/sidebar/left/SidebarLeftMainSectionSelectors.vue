<template>
  <div class="flex flex-col justify-center mx-1 transition-all duration-500">
    <div
      class="p-1 space-y-1 rounded-md bg-light-layer-2 dark:bg-dark-layer-2 elem-shadow-sm"
    >
      <!-- In the v-for don't select Home. -->
      <SidebarLeftSelector
        v-for="(item, index) in menuItems.slice(1, 3)"
        :key="index"
        :label="item.label"
        :routeURL="item.routeURL"
        :iconURL="item.iconURL"
        :selected="isActive(item.routeURL)"
        :active="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const isActive = (routeURL: string) => {
  return isRouteActive(routeURL);
};
</script>
